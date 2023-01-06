import { cloneDeep, commafy } from "@vben/utils";

const defaultUAOption: any = {
  title: {
    subtext: "点击饼图查看或收起版本详情",
    subtextStyle: {
      fontSize: 16,
    },
  },
  tooltip: {
    trigger: "item",
    formatter: (item) =>
      `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>UA：${
        item.data.name
      }</div>PV数：${commafy(item.data.value)} (${item.percent}%)`,
  },
  legend: {
    type: "scroll",
    orient: "vertical",
    left: "right",
    formatter: function (name) {
      return name.length > 10 ? name.substr(0, 30) + "..." : name;
    },
  },
  series: [
    {
      type: "pie",
      radius: ["30%", "60%"],
      center: ["40%", "50%"],
      data: [],
      // itemStyle: {
      //   shadowBlur: 10,
      //   shadowOffsetX: 0,
      //   shadowColor: 'rgba(0, 0, 0, 0.5)',
      // },
      label: {
        show: true,
        formatter: "{d}%",
      },
      legendHoverLink: false,
    },
  ],
};

const defaultUAVersionOption: any = {
  tooltip: {
    trigger: "item",
    formatter: (item) =>
      `<div style='text-align:left'><div style='display:block;word-break:break-all;white-space:pre-wrap;'>版本：${
        item.data.name
      }</div>数量：${commafy(item.data.value)}</div>`,
  },
  legend: {
    type: "scroll",
    data: [],
    orient: "vertical",
    left: "right",
    top: "30",
  },
  grid: {
    left: "3%",
    right: "120",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
    data: [],
    inverse: true,
  },
  series: [],
};

export const getUAOption = (data, hightLightName = "") => {
  if (
    !(
      data &&
      Array.isArray(data.list) &&
      Array.isArray(data.versionList) &&
      data.list.length &&
      data.versionList.length
    )
  ) {
    return null;
  }
  data = data.list.map((item) => {
    const name = item.ua_browser_name
      ? item.ua_browser_name
      : item.ua_os_name
      ? item.ua_os_name
      : "未知";
    return {
      name,
      value: item.ua_count || 0,
      itemStyle:
        hightLightName.length && hightLightName === name
          ? {
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowBlur: 10,
              borderWidth: 1,
              borderColor: "#fff",
              borderType: "solid",
            }
          : null,
    };
  });
  const chartOption = cloneDeep(defaultUAOption);
  chartOption.series[0].data = data;
  return chartOption;
};

export const getUAVersionOption = (data, type, tag) => {
  if (!data?.list?.length) {
    return null;
  }
  data = setVersionData(data, type, tag);

  let chartOption = cloneDeep(defaultUAVersionOption);

  chartOption.yAxis.data = data[0];
  chartOption.legend.data = data[1];
  for (let i = 0; i < data[2].length; i++) {
    chartOption.series.push({
      name: data[1][i],
      type: "bar",
      stack: "total",
      data: data[2][i],
    });
  }
  return chartOption;
};

//版本数据处理
const setVersionData = (data, type, tag) => {
  //filter过滤list中名字不为tag的内容
  const versionList = data.versionList.filter((item) => {
    const flag = item.ua_browser_name
      ? item.ua_browser_name
      : item.ua_os_name
      ? item.ua_os_name
      : "未知";
    return flag === tag;
  });
  const bigVersionResult = data.bigVersionResult.filter((item) => {
    const flag = item.ua_browser_name
      ? item.ua_browser_name
      : item.ua_os_name
      ? item.ua_os_name
      : "未知";
    return flag === tag;
  });

  //数据清洗整理
  let res: [any[], any[], any[]] = [[], [], []]; //res[0]为柱状图列名，res[1]为legend，res[2]为每行的数值
  //空数据处理
  if (!(versionList.length && bigVersionResult.length)) return res;
  let count: any[] = []; //每行数值，最终翻转后存入res[2]
  res[0] = bigVersionResult.map((item) => {
    let name = "";
    let list = [];
    //browser与os的后台返回参数不同，进入不同流程，但逻辑一样
    //type:browser
    if (type === "browser") {
      name = item.ua_browser_name ? item.ua_browser_name + " " + item.ua_browser_version : "未知";
      list = versionList.map((child) => {
        const c_name = child.ua_browser_name
          ? child.ua_browser_name + " " + child.big_ua_browser_version
          : "未知";
        if (name === c_name) {
          const childName =
            name === "未知" ? "未知" : child.ua_browser_name + " " + child.ua_browser_version;
          res[1].push(childName);
          return {
            name: childName,
            value: child.ua_count,
          };
        } else return { name: null, value: null };
      });
    }
    //type:os
    else {
      name = item.ua_os_name ? item.ua_os_name + " " + item.ua_os_version : "未知";
      list = versionList.map((child) => {
        const c_name = child.ua_os_name ? child.ua_os_name + " " + child.big_ua_os_version : "未知";
        if (name === c_name) {
          const childName = name === "未知" ? "未知" : child.ua_os_name + " " + child.ua_os_version;
          res[1].push(childName);
          return {
            name: childName,
            value: child.ua_count,
          };
        } else return { name: null, value: null };
      });
    }
    count.push(list);
    const value = item.ua_count || 0;
    return name + "\n" + "共计：" + commafy(value);
  });
  res[2] = count[0].map((col, i) => count.map((row) => row[i])); //翻转数组行和列，以适应echarts渲染
  return res;
};
