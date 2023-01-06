import { cloneDeep } from "@vben/utils";
import { getSummaryChartOption } from "../../../util/errorSummaryChartConfig";

//“请求数量”与“请求耗时”图表基础配置
const summaryChartConfig: any = {
  tooltip: {
    axisPointer: {
      type: "cross",
    },
    trigger: "axis",
    position(pt) {
      return [pt[0], "10%"];
    },
  },
  grid: {
    top: "2%",
    left: "2%",
    right: "2%",
    bottom: "15%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
  },
  yAxis: [
    {
      type: "value",
    },
  ],
  dataZoom: [
    {
      type: "slider",
      start: 0,
      end: 100,
    },
  ],
  series: [],
};

//获取“请求数量”统计图表的option
export function getApiAmountChartOption(data, timeFormatStr) {
  return getSummaryChartOption(data, timeFormatStr, "api");
}

//获取“请求耗时”统计图表的option
export function getTimeConsumingChartOption(data) {
  const chartOption = cloneDeep(summaryChartConfig);

  let timeList: any[] = [];
  let countList: any[] = [];
  data.forEach((item) => {
    timeList.push(item.time);
    countList.push(item.cost_time);
  });
  chartOption.xAxis.data = timeList;
  chartOption.yAxis[0].axisLabel = {
    formatter: "{value} ms",
  };
  chartOption.series = [
    {
      data: countList,
      type: "bar",
      name: "平均耗时",
      barMaxWidth: 40,
    },
  ];
  return chartOption;
}
