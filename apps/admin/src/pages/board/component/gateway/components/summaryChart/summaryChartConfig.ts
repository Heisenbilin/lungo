import { errorRateChartConfig } from '@vben/constants'
import { chartDataValue } from '@vben/types'
import { cloneDeep, commafy, getDateWeekday } from '@vben/utils'
import dayjs from 'dayjs'

//“请求数量”与“请求耗时”图表基础配置
const summaryChartConfig: any = {
  tooltip: {
    axisPointer: {
      type: 'cross',
    },
    trigger: 'axis',
    position(pt) {
      return [pt[0], '10%']
    },
  },
  grid: {
    top: '2%',
    left: '2%',
    right: '2%',
    bottom: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
  },
  yAxis: [
    {
      type: 'value',
    },
  ],
  dataZoom: [
    {
      type: 'slider',
      start: 0,
      end: 100,
    },
  ],
  series: [],
}

//获取“请求数量”统计图表的option
export function getApiAmountChartOption(data, timeFormatStr) {
  // 1. 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(errorRateChartConfig)

  // 2. 接口数据处理成图表数据
  let timeList: chartDataValue[] = [] //时间数据
  let countList: chartDataValue[] = [] //请求数
  let rateList: chartDataValue[] = [] //成功率
  data.forEach(item => {
    const formatTime = dayjs(item.time).format(timeFormatStr)
    const totalCount = item.count
    const successCount = totalCount - item.failCount
    const rate = totalCount ? ((successCount * 100) / totalCount).toFixed(2) : null //防止totalCount为0
    timeList.push({ value: formatTime, name: `${item.time}${getDateWeekday(item.time)}` })
    // 使用{name:...,value:...}的格式可以往里面塞更多数据
    countList.push({ name: `总请求数：${commafy(totalCount)}`, value: totalCount })
    rateList.push({
      name: `请求成功率：${rate}% (异常请求数：${commafy(successCount)})`,
      value: rate,
    })
  })

  // 3. 设置热力线区间
  const maxRate = Math.max(...rateList.map(item => (item.value ? Number(item.value) : 0)))
  const minRate = Math.min(...rateList.map(item => (item.value ? Number(item.value) : 0)))
  if (maxRate > 0) {
    chartOption.visualMap.max = Math.ceil(maxRate * 10) / 10 //向上取整，美化坐标轴、防止数据js溢出
    chartOption.visualMap.min = minRate * 0.5
  } // 防止maxRate为0或为nan
  chartOption.gradientColor = ['#ee6666', '#fac858', '#92cb74']

  // 4. 数据存入chartOption
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  chartOption.series[0].name = '请求数量'
  chartOption.series[1].data = rateList
  chartOption.series[1].name = '请求成功率'

  // 5. 当坐标过多时，显示滚动条
  if (timeList.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}

//获取“请求耗时”统计图表的option
export function getTimeConsumingChartOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(summaryChartConfig)
  let timeList: any[] = []
  let countList: any[] = []
  data.forEach(item => {
    timeList.push(item.time)
    countList.push(item.cost_time)
  })
  chartOption.xAxis.data = timeList
  chartOption.yAxis[0].axisLabel = {
    formatter: '{value} ms',
  }
  chartOption.series = [
    {
      data: countList,
      type: 'bar',
      name: '平均耗时',
      barMaxWidth: 40,
    },
  ]
  return chartOption
}
