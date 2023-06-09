import { cloneDeep, commafy } from '@vben/utils'
import dayjs from 'dayjs'
import { getAPISummaryChartOption } from '@/logics/chartOption/errorSummary'

//“请求数量”与“请求耗时”图表基础配置
const summaryChartConfig: any = {
  tooltip: {
    axisPointer: {
      type: 'cross',
    },
    trigger: 'axis',
    formatter: item => item.map(data => data.name).join('<br/>'),
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
  return getAPISummaryChartOption(data, timeFormatStr)
}

//获取“请求耗时”统计图表的option
export function getTimeConsumingChartOption(data, timeFormatStr) {
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(summaryChartConfig)

  let timeList: any[] = []
  let countList: any[] = []
  data.forEach(item => {
    timeList.push({ name: dayjs(item.time).format(timeFormatStr), value: item.time })
    countList.push({
      name: `${item.time}</br>平均耗时：${commafy(item.elapsed_time)}<br/>采样请求量:${commafy(
        item.errorCount || item.successCount,
      )}`,
      value: item.elapsed_time,
    })
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
