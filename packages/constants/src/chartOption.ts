//饼图基础配置
export const pieChartOption: any = {
  tooltip: {
    trigger: 'item',
    confine: true,
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    left: 'right',
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      animationEasing: 'cubicInOut',
      animationDuration: 3000,
      label: {
        show: false,
      },
    },
  ],
}

//饼图基础配置
export const logInfoTitle: any = {
  text: '提示：点击饼图可查看对应日志',
  bottom: '0',
  right: '0',
  textStyle: {
    color: '#909399',
    fontSize: 14,
  },
}

//折线图基础配置
export const lineChartOption: any = {
  tooltip: {
    axisPointer: {
      type: 'cross',
    },
    trigger: 'axis',
    formatter: item =>
      `<font style="color:green">${item[0]?.axisValue}</font><br/>` +
      item.map(data => data.name).join('<br/>'),
  },
  legend: {},
  grid: {
    top: '10%',
    left: '2%',
    right: '2%',
    bottom: '2%',
    containLabel: true,
  },
  dataZoom: {
    type: 'slider',
    show: false,
    start: 0,
    end: 100,
  },
  xAxis: {
    type: 'category',
  },
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [],
}

//柱状图基础配置
export const barChartOption: any = {
  tooltip: {
    axisPointer: {
      type: 'cross',
    },
    trigger: 'axis',
    formatter: item =>
      `<font style="color:green">${item[0]?.axisValue}</font><br/>` +
      item.map(data => data.name).join('<br/>'),
  },
  dataZoom: {
    type: 'slider',
    show: false,
    start: 0,
    end: 100,
  },
  legend: {},
  grid: {
    top: '10%',
    left: '2%',
    right: '2%',
    bottom: '2%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar',
      data: [],
      barMaxWidth: 40,
    },
  ],
}

export const xAxisMaxLength = 15

export const errorRateChartConfig: any = {
  color: ['#5c7bd8', '#ee6666', '#92CC76'], // 蓝绿
  //热力线
  visualMap: {
    show: false,
    type: 'continuous',
    seriesIndex: 1,
    min: 0,
    max: 100,
  },
  tooltip: {
    axisPointer: {
      type: 'cross',
    },
    trigger: 'axis',
    formatter: item =>
      `<font style="color:green">${item[0]?.axisValue}</font><br/>` +
      item.map(data => data.name).join('<br/>'),
  },
  legend: {},
  grid: {
    top: '10%',
    left: '2%',
    right: '2%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
  },
  yAxis: [
    {
      name: '数量',
      nameTextStyle: { padding: [0, 40, 0, 0] },
      type: 'value',
    },
    {
      name: '百分比',
      nameTextStyle: { padding: [0, 0, 0, 45] },
      type: 'value',
      position: 'right',
      axisLabel: {
        formatter: '{value} %',
      },
      splitLine: {
        show: false,
      },
    },
  ],
  dataZoom: {
    type: 'slider',
    show: false,
    start: 0,
    end: 100,
  },
  series: [
    {
      data: [],
      type: 'bar',
      name: '异常数量',
      barMaxWidth: 40,
    },
    {
      data: [],
      type: 'line',
      smooth: true,
      name: '异常次数PV比',
      yAxisIndex: 1,
    },
  ],
}
