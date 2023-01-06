import { cloneDeep, commafy, compare, getMainInfo } from "@vben/utils";
import { pieChartOption, logInfoTitle } from "@vben/constants";

// 客户端数字key对应的客户端类型
export const clientUserAgent = {
  7: "pc",
  8: "web",
  9: "android",
  10: "ios",
};

//将接口返回值处理成“异常Top10”图表数据
export function getTop10Option(data, infoLength = 40) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("board_count")).slice(0, 10); //数据排序并取前十
  let seriesData = data.map((item) => ({
    value: item.board_count,
    name: item.board_key || "未知",
  }));
  chartOption.legend!.formatter! = (name) => getMainInfo(name, infoLength);
  chartOption.tooltip!.formatter! = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>异常内容：${
      item.data.name
    }</div>次数：${commafy(item.data.value)} (${item.percent}%)`;
  chartOption.series![0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“错误类型”图表数据
export function getErrorTypeOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("count"));
  let seriesData = data.map((item) => ({
    value: item.count,
    name: item.type || "未知",
  }));
  chartOption.legend.formatter = (name) => getMainInfo(name, 40);
  chartOption.tooltip.formatter = (item) =>
    `<div>错误类型：${item.data.name}</div>
    资源数：${commafy(item.data.value)} (${item.percent}%)`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“容错域名”图表数据
export function getFaultTolerantOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("board_count"));
  let seriesData = data.map((item) => ({
    value: item.board_count,
    name: item.board_key || "未知",
  }));
  chartOption.legend.formatter = (name) => getMainInfo(name, 40);
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>域名：${
      item.data.name
    }</div>资源数：${commafy(item.data.value)} (${item.percent}%)`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“容错次数”图表数据
export function getFaultTolerantTimesOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  // data = data.sort(compare('board_count'));
  let seriesData = data.map((item) => ({
    value: item.board_count,
    name: item.board_key + "次",
  }));
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>${
      item.data.name
    }：${commafy(item.data.value)}条资源 (${item.percent}%)</div>`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“异常Top10 URL”图表数据
export function getTop10UrlOption(data, type) {
  if (!data) return null;
  data = data[type];
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("board_count")).slice(0, 10);
  let seriesData = data.map((item) => ({
    value: item.board_count,
    name: item.board_url || "未知",
  }));
  chartOption.title = logInfoTitle;
  chartOption.legend.formatter = (name) => getMainInfo(name, 40);
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>URL：${
      item.data.name
    }</div>异常数：${commafy(item.data.value)} (${item.percent}%)`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“状态码”图表数据
export function getStatusChartOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("count"));
  let seriesData = data.map((item) => ({
    value: item.count,
    name: item.status || "未知",
  }));
  chartOption.legend.selected = {
    200: false,
  };
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>响应码：${
      item.data.name
    }</div>次数：${commafy(item.data.value)} (${item.percent}%)`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“耗时统计”图表数据
export function getCostTimeChartOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("count"));
  let seriesData = data.map((item) => ({
    value: item.count,
    name: item.costTime,
  }));
  chartOption.legend.selected = {
    "0 to 200": false,
  };
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>耗时区间：${
      item.data.name
    } ms</div>
    次数：${commafy(item.data.value)} (${item.percent}%)`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成网关“耗时统计”图表数据
export function getGateWayCostTimeChartOption(data) {
  if (!(typeof data === "object" && Object.keys(data).length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  let seriesData = data.map((item) => ({
    name: item.costTime,
    value: item.count,
  }));
  chartOption.title = logInfoTitle;
  chartOption.legend.selected = {
    "0 to 200": false,
  };
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>耗时区间：${
      item.data.name
    } ms</div>
    次数：${commafy(item.data.value)} (${item.percent}%)`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“网络类型”图表数据
export function getNetworkTypeOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("board_count"));
  let seriesData = data.map((item) => ({
    value: item.board_count,
    name: item.board_key || "未知",
    pageload: item.pageload || 0,
  }));
  chartOption.legend.formatter = (name) => getMainInfo(name, 40);
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>网络类型：${
      item.data.name
    }</div>PV数：${commafy(item.data.value)} (${item.percent}%)<br/>页面平均加载时间：${commafy(
      item.data.pageload
    )}ms`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“客户端类型”图表数据
export function getClientTypeOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("board_count"));
  let seriesData = data.map((item) => ({
    value: item.board_count,
    name: clientUserAgent[item.board_key] || "未知",
    pageload: item.pageload || 0,
  }));
  chartOption.legend.formatter = (name) => getMainInfo(name, 40);
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>客户端：${
      item.data.name
    }</div>PV数：${commafy(item.data.value)} (${item.percent}%)<br/>页面平均加载时间：${commafy(
      item.data.pageload
    )}ms`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}

//将接口返回值处理成“设备类型”图表数据
export function getDeviceTypeOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(pieChartOption);
  data = data.sort(compare("board_count")).slice(0, 50);
  let seriesData = data.map((item) => ({
    value: item.board_count,
    name: item.board_key || "未知",
    pageload: item.pageload || 0,
  }));
  chartOption.legend.formatter = (name) => getMainInfo(name, 40);
  chartOption.tooltip.formatter = (item) =>
    `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>设备：${
      item.data.name
    }</div>PV数：${commafy(item.data.value)} (${item.percent}%)<br/>页面平均加载时间：${commafy(
      item.data.pageload
    )}ms`;
  chartOption.series[0].data = seriesData;
  return chartOption;
}
