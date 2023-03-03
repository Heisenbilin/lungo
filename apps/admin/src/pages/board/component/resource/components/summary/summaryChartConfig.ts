import { cloneDeep, commafy, accSub, getDateWeekday } from '@vben/utils'

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

export const getFaultTolerantChartOption = (data, hasSuccessData = false) => {
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  const chartOption = cloneDeep(summaryChartConfig)
  if (!hasSuccessData) {
    //无容错数据时，不展示容错成功数和接入容错前异常率
    chartOption.legend.selected = latestsSelectedLegend
  }

  const timeList: any[] = [] //时间数据
  const countList: any[] = [] //异常资源数
  const rateList: any[] = [] //异常率(容错后)
  const uvRateList: any[] = [] //影响用户率
  const successCountList: any[] = [] //异常容错数
  const beforeRateList: any[] = [] //容错前异常率
  data.forEach(item => {
    const count = item.resource_num
    const successCount = item.resource_success_num
    const pvCount = item.pv
    const uvCount = item.uv
    const userCount = item.error_uv
    const totalCount = count + successCount

    //比率
    const rate = totalCount ? ((count * 100) / totalCount).toFixed(2) : 0 //容错失败率
    const beforeRate = pvCount ? ((totalCount * 100) / pvCount).toFixed(2) : null //容错前的异常率
    const afterRate = pvCount ? ((count * 100) / pvCount).toFixed(2) : null //容错后的异常率
    const uvRate = uvCount ? ((userCount * 100) / uvCount).toFixed(2) : null //影响用户率

    timeList.push({ value: item.time, name: item.originTime })
    countList.push({
      name: `${
        item.time + ' ' + getDateWeekday(item.originTime)
      }<br/>异常资源数（容错后）：${commafy(count)}`,
      value: count,
    })
    rateList.push({
      name: `异常率：${afterRate}%（PV数：${commafy(pvCount)}）`,
      value: afterRate,
    })
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
      name: `接入容错前异常率：${beforeRate}%（优化${accSub(beforeRate, afterRate)}%）`,
      value: beforeRate,
    })
  })

  //存入数据
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  chartOption.series[1].data = rateList
  chartOption.series[2].data = uvRateList
  chartOption.series[3].data = successCountList
  chartOption.series[4].data = beforeRateList

  if (timeList.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}
