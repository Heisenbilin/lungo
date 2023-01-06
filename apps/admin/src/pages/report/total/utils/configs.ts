import { cloneDeep } from "@vben/utils";


//图表基础配置
const defaultTwoWeeksOption = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      magicType: { type: ['line', 'bar'] },
      restore: {},
    },
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '上周',
      type: 'line',
      data: [],
    },
    {
      name: '本周',
      type: 'line',
      data: [],
    },
  ],
};

//将接口返回值处理成图表数据
export function getTwoWeeksOption(data, type) {
  if (!data.lastWeek[type].length || !data.currentWeek[type].length) {
    return null;
  }

  const chartOption = cloneDeep(defaultTwoWeeksOption);

  chartOption.series[0].data = data.lastWeek[type];
  chartOption.series[1].data = data.currentWeek[type];

  return chartOption;
}
