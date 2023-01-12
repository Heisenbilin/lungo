import { cloneDeep, commafy, getDateWeekday, dataAggregateByTime } from '@vben/utils'

//“PV”与“UV”图表基础配置
const PVUVChartConfig: any = {
  xAxis: {
    boundaryGap: false,
    axisTick: {
      show: false,
    },
    data: [],
  },
  grid: {
    top: 10,
    left: '2%',
    right: '3%',
    bottom: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    formatter: item => {
      return `${item[0].data.name}<br/>
              数量：${commafy(item[0].value)}<br/>`
    },
  },
  yAxis: {
    axisTick: {
      show: false,
    },
    type: 'value',
  },
  dataZoom: [
    {
      type: 'slider',
      start: 0,
      end: 100,
      show: false,
    },
  ],
  series: [
    {
      data: [],
      type: 'line',
      animation: false,
    },
  ],
}

//将接口返回值处理成“状态码”图表数据
export function getPVUVChartOption(data, timeFormatStr) {
  if (!Array.isArray(data) || data.length === 0) {
    return null
  }
  const chartOption = cloneDeep(PVUVChartConfig)
  const aggregatedData = dataAggregateByTime(data, timeFormatStr) //聚合数据
  let timeList: any[] = [] //时间数据
  let countList: any[] = [] //异常数
  Object.keys(aggregatedData).forEach(key => {
    timeList.push(key)
    countList.push({
      name: key + ' ' + getDateWeekday(aggregatedData[key].originTime),
      value: aggregatedData[key].boardCount,
    })
  })
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList

  if (timeList.length > 20) {
    chartOption.dataZoom[0].show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}
