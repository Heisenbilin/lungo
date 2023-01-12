import { cloneDeep, commafy, accSub, getDateWeekday } from '@vben/utils'
import { dataAggregateByTime } from '@vben/utils'

//图表基础配置
//柱状图与曲线图结合，支持时间范围选择
const summaryChartConfig: any = {
  color: ['#5470C6', '#91CC75', '#EE6666'],
  //热力线
  visualMap: {
    show: false,
    type: 'continuous',
    seriesIndex: 2,
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
      PV数：${commafy(item[0].data.name.pvCount)}<br/>
      异常资源数：${commafy(item[0].value)}次 （异常率：${item[0].data.name.afterRate}%）<br/>
      容错成功数：${commafy(item[1].value)}次 （容错失败率：${item[1].data.name}%）<br/>
      接入容错前异常率：${item[0].data.name.beforeRate}%（优化${accSub(
        item[0].data.name.beforeRate,
        item[0].data.name.afterRate,
      )}%）`
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
      name: '异常资源数',
      barMaxWidth: 40,
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
      name: '异常率',
      nameTextStyle: { align: 'right' },
      yAxisIndex: 1,
    },
    {
      data: [],
      type: 'line',
      smooth: true,
      name: '接入容错前异常率',
      nameTextStyle: { align: 'right' },
      yAxisIndex: 1,
    },
    {
      data: [],
      type: 'line',
      smooth: true,
      name: '容错失败率',
      yAxisIndex: 1,
    },
  ],
}

var latestsSelectedLegend = '{"异常率":true,"接入容错前异常率":false,"容错失败率":false}'

export const getFaultTolerantChartOption = (data, timeFormatStr, selectedLegend) => {
  //1 数据为空时，返回null，图表为空状态
  data = cleanData(data, timeFormatStr) //清洗数据
  if (!(Array.isArray(data) && data.length)) {
    return null
  }

  //2 legend变换时，直接返回{}（代表不更新chartOption），echarts底层自动进行图表渲染
  if (latestsSelectedLegend !== JSON.stringify(selectedLegend.selected)) {
    latestsSelectedLegend = JSON.stringify(selectedLegend.selected)
    return {}
  }

  //3 非legend变换（data变换或者timeFormatStr变换），处理data数据成图表Option
  const chartOption = cloneDeep(summaryChartConfig)
  let timeList: any[] = [] //时间数据
  let countList: any[] = [] //异常资源数
  let successCountList: any[] = [] //异常容错数
  let rateList: any[] = [] //异常率
  let beforeRateList: any[] = [] //容错前异常率
  let afterRateList: any[] = [] //容错后异常率
  data.forEach(item => {
    const count = item.count
    const successCount = item.successCount
    const pvCount = item.pvCount
    const totalCount = count + successCount

    //比率
    const rate = totalCount ? ((count * 100) / totalCount).toFixed(2) : 0 //容错失败率
    const beforeRate = pvCount ? ((totalCount * 100) / pvCount).toFixed(2) : null //容错前的异常率
    const afterRate = pvCount ? ((count * 100) / pvCount).toFixed(2) : null //容错后的异常率

    timeList.push({ value: item.time, name: item.originTime })
    countList.push({
      name: {
        pvCount,
        beforeRate,
        totalCount,
        afterRate,
        holeTime: item.time + ' ' + getDateWeekday(item.originTime),
      },
      value: count,
    })
    successCountList.push({
      name: rate,
      value: successCount,
    })
    rateList.push(rate)
    beforeRateList.push(beforeRate)
    afterRateList.push(afterRate)
  })

  //设置异常率热力线的区间
  const maxRate = Math.max(...afterRateList.map(item => (item ? item : 0)))
  const minRate = Math.max(...afterRateList.map(item => (item ? item : 0)))
  if (maxRate > 0) {
    chartOption.visualMap.max = Math.ceil(maxRate * 10) / 10 //向上取整，美化坐标轴、防止数据js溢出
    chartOption.visualMap.min = minRate * 0.5
  } //防止maxRate为0或为nan

  //存入数据
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  chartOption.series[1].data = successCountList
  chartOption.series[2].data = afterRateList
  chartOption.series[3].data = beforeRateList
  chartOption.series[4].data = rateList

  if (timeList.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  //绑定legend选择的状态
  chartOption.legend.selected = selectedLegend.selected

  return chartOption
}

//数据清洗
const cleanData = (data, timeFormatStr) => {
  if (!Array.isArray(data) || data.length === 0) {
    return []
  }
  const result = {
    pv: [],
    resource_num: [],
    resource_success_num: [],
  }
  //按照类型聚合数据
  data.forEach(item => {
    const key = item.board_type.split('_').slice(1).join('_') //去掉前置id
    //按key来区分
    if (result[key]) {
      result[key].push(item)
    } else {
      result[key] = [item]
    }
  })
  //按照时间聚合数据，合并每时间段内的总数量
  for (const key in result) {
    result[key] = dataAggregateByTime(result[key], timeFormatStr)
  }
  const chartData: any[] = []

  if ('pv' in result && Object.keys(result.pv).length) {
    Object.keys(result.pv).forEach(time => {
      //资源异常资源数据是否有对应容错数据标志
      const flag1 = Object.keys(result.resource_num).length && result.resource_num[time]?.boardCount
      //资源异常资源数据是否有对应容错数据标志
      const flag2 =
        Object.keys(result.resource_success_num).length &&
        result.resource_success_num[time]?.boardCount
      //最终数据格式
      chartData.push({
        count: flag1 ? result.resource_num[time].boardCount : 0,
        pvCount: result.pv[time].boardCount,
        successCount: flag2 ? result.resource_success_num[time].boardCount : 0,
        time: time,
        originTime: result.pv[time].originTime,
      })
    })
  }
  return chartData
}
