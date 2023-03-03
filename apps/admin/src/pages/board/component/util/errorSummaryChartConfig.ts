import { cloneDeep, commafy, getDateWeekday } from '@vben/utils'
import dayjs from 'dayjs'

//图表基础配置
//柱状图与曲线图结合，支持时间范围选择
const summaryChartConfig: any = {
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
    position(pt) {
      return [pt[0], '10%']
    },
    formatter: item => item.map(data => data.name).join('<br/>'),
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

//获取运行时异常图表的option
export function getSummaryChartOption(data, timeFormatStr) {
  //1 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(summaryChartConfig)
  const timeList: any[] = [] //时间数据
  const countList: any[] = [] //异常数
  const rateList: any[] = [] //异常率
  const userRateList: any[] = [] //影响用户率
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
      name: `${item.time}${getDateWeekday(item.time)}<br/>异常数量：${commafy(count)}`,
      value: count,
    })
    rateList.push({
      name: `异常次数PV比：${rate}% (PV数：${commafy(pvCount)})`,
      value: rate,
    })
    userRateList.push({
      name: `影响用户占比：${userRate}% (影响用户数：${commafy(errorUserCount)})`,
      value: userRate,
    })
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
  chartOption.series[2] = {
    data: userRateList,
    type: 'line',
    smooth: true,
    name: '影响用户占比',
    yAxisIndex: 1,
  }

  if (timeList.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}

export function getAPISummaryChartOption(data, timeFormatStr) {
  //1 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(summaryChartConfig)
  let timeList: any[] = [] //时间数据
  let countList: any[] = [] //请求数
  let rateList: any[] = [] //成功率
  data.forEach(item => {
    const formatTime = dayjs(item.time).format(timeFormatStr)
    const successCount = item.success
    const errorCount = item.error
    const totalCount = item.total
    const rate = totalCount ? ((successCount * 100) / totalCount).toFixed(2) : null //防止totalCount为0
    timeList.push({ value: formatTime, name: item.time })
    //使用{name:...,value:...}的格式可以往里面塞更多数据
    countList.push({
      name: `${item.time}${getDateWeekday(item.time)}<br/>总请求数：${commafy(totalCount)}`,
      value: totalCount,
    })
    rateList.push({
      name: `请求成功率：${rate}% (异常请求数：${commafy(errorCount)})`,
      value: rate,
    })
  })

  //设置热力线区间
  const maxRate = Math.max(...rateList.map(item => (item ? item : 0)))
  const minRate = Math.min(...rateList.map(item => (item ? item : 0)))
  if (maxRate > 0) {
    chartOption.visualMap.max = Math.ceil(maxRate * 10) / 10 //向上取整，美化坐标轴、防止数据js溢出
    chartOption.visualMap.min = minRate * 0.5
  } //防止maxRate为0或为nan
  chartOption.gradientColor = ['#ee6666', '#fac858', '#92cb74']

  //存入数据
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  chartOption.series[0].name = '请求数量'
  chartOption.series[1].data = rateList
  chartOption.series[1].name = '请求成功率'

  if (timeList.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}
