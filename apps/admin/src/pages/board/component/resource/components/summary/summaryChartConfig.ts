import { xAxisMaxLength } from '@vben/constants'
import { chartDataValue } from '@vben/types'
import { cloneDeep, commafy, accSub } from '@vben/utils'
import dayjs from 'dayjs'

//图表基础配置
//柱状图与曲线图结合，支持时间范围选择
const summaryChartConfig: any = {
  color: ['#5c7bd8', '#ee6666', '#8f7acf', '#92CC76'], // 蓝绿
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
      name: '异常资源数',
      barMaxWidth: 40,
    },
    {
      data: [],
      type: 'line',
      smooth: true,
      name: '异常率',
      nameTextStyle: { align: 'right' },
      yAxisIndex: 1,
    },
    {
      data: [],
      type: 'line',
      smooth: true,
      name: '影响用户率',
      nameTextStyle: { align: 'right' },
      yAxisIndex: 1,
    },
    {
      data: [],
      type: 'bar',
      name: '容错成功数',
      barMaxWidth: 40,
    },
    {
      data: [],
      type: 'line',
      smooth: true,
      name: '接入容错前异常率',
      nameTextStyle: { align: 'right' },
      yAxisIndex: 1,
    },
  ],
}

var latestsSelectedLegend = { 接入容错前异常率: false, 容错成功数: false }

export const getFaultTolerantChartOption = (
  data: any,
  timeFormatStr: string,
  hasSuccessData = false,
) => {
  // 1. 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(summaryChartConfig)
  if (!hasSuccessData) {
    //无容错数据时，不展示容错成功数和接入容错前异常率
    chartOption.legend.selected = latestsSelectedLegend
  }

  // 2. 接口数据处理成图表数据
  const timeList: chartDataValue[] = [] //时间数据
  const countList: chartDataValue[] = [] //异常资源数
  const rateList: chartDataValue[] = [] //异常率(容错后)
  const uvRateList: chartDataValue[] = [] //影响用户率
  const successCountList: chartDataValue[] = [] //异常容错数
  const beforeRateList: chartDataValue[] = [] //容错前异常率
  data.forEach(item => {
    const formatTime = dayjs(item.time).format(timeFormatStr)
    const count = item.resource_num
    const successCount = item.resource_success_num
    const pvCount = item.pv
    const uvCount = item.uv
    const userCount = item.error_uv
    const totalCount = count + successCount
    const rate = totalCount ? ((count * 100) / totalCount).toFixed(2) : 0 //容错失败率
    const beforeRate = pvCount ? ((totalCount * 100) / pvCount).toFixed(2) : null //容错前的异常率
    const afterRate = pvCount ? ((count * 100) / pvCount).toFixed(2) : null //容错后的异常率
    const uvRate = uvCount ? ((userCount * 100) / uvCount).toFixed(2) : null //影响用户率
    timeList.push({ value: formatTime, name: item.time })
    countList.push({ name: `异常资源数（容错后）：${commafy(count)}`, value: count })
    rateList.push({ name: `异常率：${afterRate}%（PV数：${commafy(pvCount)}）`, value: afterRate })
    uvRateList.push({
      name: `影响用户率：${uvRate}%（影响用户数：${commafy(userCount)}，总UV：${commafy(
        uvCount,
      )}）`,
      value: uvRate,
    })
    successCountList.push({
      name: `容错成功数：${commafy(successCount)} （容错失败率：${rate}%）`,
      value: successCount,
    })
    beforeRateList.push({
      name: `接入容错前异常率：${beforeRate}%（容错后减少${accSub(beforeRate, afterRate)}%）`,
      value: beforeRate,
    })
  })

  // 3. 设置热力线区间
  const maxRate = Math.max(...rateList.map(item => (item.value ? Number(item.value) : 0)))
  const minRate = Math.min(...rateList.map(item => (item.value ? Number(item.value) : 0)))
  if (maxRate > 0) {
    chartOption.visualMap.max = Math.ceil(maxRate * 10) / 10 //向上取整，美化坐标轴、防止数据js溢出
    chartOption.visualMap.min = minRate * 0.5
  } // 防止maxRate为0或为nan

  // 4. 存入数据
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  chartOption.series[1].data = rateList
  chartOption.series[2].data = uvRateList
  chartOption.series[3].data = successCountList
  chartOption.series[4].data = beforeRateList

  // 5. 当坐标过多时，显示滚动条
  if (timeList.length > xAxisMaxLength) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }
  return chartOption
}
