import { cloneDeep, commafy } from '@vben/utils'
import { errorRateChartConfig, xAxisMaxLength } from '@vben/constants'
import { type chartDataValue } from '@vben/types'
import dayjs from 'dayjs'

// 获取运行时异常图表的option
export function getSummaryChartOption(data: any, timeFormatStr: string) {
  // 1. 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(errorRateChartConfig)

  // 2. 接口数据处理成图表数据
  const timeList: chartDataValue[] = [] //时间数据
  const countList: chartDataValue[] = [] //异常数
  const rateList: chartDataValue[] = [] //异常率
  const userRateList: chartDataValue[] = [] //影响用户率
  data.forEach(item => {
    const formatTime = dayjs(item.time).format(timeFormatStr)
    const count = item.errorCount
    const userCount = item.userCount
    const errorUserCount = item.errorUserCount
    const pvCount = item.pvCount
    const rate = pvCount ? ((count * 100) / pvCount).toFixed(2) : null
    const userRate = userCount ? ((errorUserCount * 100) / userCount).toFixed(2) : null
    //使用{name:...,value:...}的格式可以往里面塞更多数据
    timeList.push({ value: formatTime, name: item.time })
    countList.push({
      name: `异常数量：${commafy(count)}`,
      value: count,
    })
    rateList.push({ name: `异常次数PV比：${rate}% (PV数：${commafy(pvCount)})`, value: rate })
    userRateList.push({
      name: `影响用户占比：${userRate}% (影响用户数：${commafy(errorUserCount)})`,
      value: userRate,
    })
  })

  // 3. 设置热力线区间
  const maxRate = Math.max(...rateList.map(item => (item.value ? Number(item.value) : 0)))
  const minRate = Math.min(...rateList.map(item => (item.value ? Number(item.value) : 0)))
  if (maxRate > 0) {
    chartOption.visualMap.max = Math.ceil(maxRate * 10) / 10 //向上取整，美化坐标轴、防止数据js溢出
    chartOption.visualMap.min = minRate * 0.5
  } //防止maxRate为0或为nan

  // 4. 数据存入chartOption
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  chartOption.series[1].data = rateList
  chartOption.series[2] = {
    data: userRateList,
    type: 'line',
    smooth: true,
    name: '影响用户占比',
    yAxisIndex: 1,
  }

  // 5. 当坐标过多时，显示滚动条
  if (timeList.length > xAxisMaxLength) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}

export function getAPISummaryChartOption(data, timeFormatStr) {
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
    const successCount = item.success
    const errorCount = item.error
    const totalCount = item.total
    const rate = totalCount ? ((successCount * 100) / totalCount).toFixed(2) : null //防止totalCount为0
    timeList.push({ value: formatTime, name: item.time })
    // 使用{name:...,value:...}的格式可以往里面塞更多数据
    countList.push({ name: `总请求数：${commafy(totalCount)}`, value: totalCount })
    rateList.push({
      name: `请求成功率：${rate}% (异常请求数：${commafy(errorCount)})`,
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
