import { cloneDeep, commafy, formatDateString, getDateWeekday } from '@vben/utils'

//图表基础配置
//柱状图与曲线图结合，支持时间范围选择
const summaryChartConfig: any = {
  color: ['#5470C6', '#EE6666'],
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
    position(pt) {
      return [pt[0], '10%']
    },
    formatter: item => {
      return `${item[0].data.name.holeTime}<br/>
              异常数量：${commafy(item[0].value)}<br/>
              ${item[0].data.name.isApi ? '请求总数' : 'PV数'}：
              ${commafy(item[0].data.name.total)}<br/>
              异常率：${item[0].data.name.rate ? item[0].data.name.rate + '%' : ''}`
    },
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
      name: '异常率',
      yAxisIndex: 1,
    },
  ],
}

//获取运行时异常图表的option
export function getSummaryChartOption(data, timeFormatStr, isApi = '') {
  //1 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(summaryChartConfig)
  let timeList: any[] = [] //时间数据
  let countList: any[] = [] //异常数
  let rateList: any[] = [] //异常率
  data.forEach(item => {
    const count = isApi ? item.failCount : item.count
    const totalCount = isApi ? item.count : item.pvCount
    const rate = totalCount ? ((count * 100) / totalCount).toFixed(2) : null //防止totalCount为0
    timeList.push({ value: formatDateString(item.time, timeFormatStr), name: item.time })
    //使用{name:...,value:...}的格式可以往里面塞更多数据
    countList.push({
      name: {
        total: totalCount,
        isApi,
        holeTime: item.time + ' ' + getDateWeekday(item.time),
        rate: rate,
      },
      value: count,
    })
    rateList.push(rate)
  })

  //设置热力线区间
  const maxRate = Math.max(...rateList.map(item => (item ? item : 0)))
  const minRate = Math.min(...rateList.map(item => (item ? item : 0)))
  if (maxRate > 0) {
    chartOption.visualMap.max = Math.ceil(maxRate * 10) / 10 //向上取整，美化坐标轴、防止数据js溢出
    chartOption.visualMap.min = minRate * 0.5
  } //防止maxRate为0或为nan

  //存入数据
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  chartOption.series[1].data = rateList

  if (timeList.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}
