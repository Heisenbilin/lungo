import { cloneDeep } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { lineChartOption } from '@vben/constants'
import { type chartDataValue } from '@vben/types'
import dayjs from 'dayjs'

const boardStore = useBoardStore()

//图表基础配置
//柱状图与曲线图结合，支持时间范围选择
const summaryChartConfig: any = {
  tooltip: {
    axisPointer: {
      type: 'cross',
    },
    trigger: 'axis',
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
      name: '采样PV数',
      nameTextStyle: { padding: [0, 0, 0, 45] },
      type: 'value',
      position: 'right',
    },
    {
      name: '耗时',
      nameTextStyle: { padding: [0, 50, 0, 0] },
      type: 'value',
      axisLabel: {
        formatter: '{value} ms',
      },
      splitLine: {
        show: false,
      },
    },
  ],
  dataZoom: {
    show: false,
    start: 0,
    end: 100,
  },
  series: [
    {
      data: [],
      type: 'bar',
      name: '采样PV数',
      barMaxWidth: 40,
    },
  ],
}

const keysConfig = {
  time: { value: [] },
  count: { name: 'PV值', value: [] },
  firstbyte: { name: '首字节', value: [] },
  ready: { name: 'DOM Ready', value: [] },
  load: { name: '页面完全加载', value: [] },
  dns: { name: 'DNS', value: [] },
  tcp: { name: 'TCP', value: [] },
  ssl: { name: 'SSL', value: [] },
  ttfb: { name: '请求响应', value: [] },
  trans: { name: '内容传输', value: [] },
  dom: { name: 'DOM解析', value: [] },
  res: { name: '资源加载', value: [] },
  rtt: { name: 'RTT', value: [] },
  fcp: { name: 'FCP', value: [] },
  fp: { name: 'FP', value: [] },
  rd: { name: 'RD', value: [] },
  tti: { name: 'TTI', value: [] },
}

//获取运行时异常图表的option
export function getSummaryChartOption(data) {
  //1 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }

  //3 非legend变换（data变换），处理data数据成图表Option
  const chartOption = cloneDeep(summaryChartConfig)
  const valueArrs = cloneDeep(keysConfig)

  //3.1 数据转换，存入valueArrs
  try {
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (valueArrs[key]) valueArrs[key].value.push(item[key])
      })
    })
  } catch (e) {
    console.log(e)
    return null
  }
  const timeFormatStr = boardStore.getTimeFormatStr
  //3.2 将valueArrs中的数据存入chartOption中
  //3.2.1 横坐标：时间数据
  chartOption.xAxis.data = valueArrs.time.value.map(time => ({
    value: dayjs(time).format(timeFormatStr),
    name: time,
  }))
  //时间数据过多时，添加底部滑块
  if (valueArrs.time.value.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  //3.2.2 series0存入PV数据
  chartOption.series[0].data = valueArrs.count.value

  //3.2.3 依此往后续series存入性能指标曲线数据，并获取
  Object.keys(valueArrs).forEach(key => {
    if (!['count', 'time'].includes(key)) {
      chartOption.series.push({
        data: valueArrs[key].value,
        type: 'line',
        smooth: true,
        name: valueArrs[key].name,
        yAxisIndex: 1,
      })
    }
  })

  //3.2.4 绑定legend选择的状态
  chartOption.legend.selected = {
    DNS: false,
    TCP: false,
    SSL: false,
    请求响应: false,
    内容传输: false,
    DOM解析: false,
    资源加载: false,
    RTT: false,
    FCP: false,
    FP: false,
    RD: false,
    TTI: false,
  }

  return chartOption
}

//获取时间区间图表的option
export function getContrastChartOption(data) {
  //1 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }

  const chartOption = cloneDeep(lineChartOption)
  const timeFormatStr = boardStore.getTimeFormatStr

  const timeList: chartDataValue[] = []
  const lte1RateArr: chartDataValue[] = []
  const lte2RateArr: chartDataValue[] = []
  const lte5RateArr: chartDataValue[] = []
  try {
    data.forEach(item => {
      timeList.push({
        value: dayjs(item.time).format(timeFormatStr),
        name: item.time,
      })
      const lte1Rate = item.total ? ((item.lte1 * 100) / item.total).toFixed(2) : '0'
      const lte2Rate = item.total ? ((item.lte2 * 100) / item.total).toFixed(2) : '0'
      const lte5Rate = item.total ? ((item.lte5 * 100) / item.total).toFixed(2) : '0'
      lte1RateArr.push({ value: lte1Rate, name: `1S快开比：${lte1Rate}%` })
      lte2RateArr.push({ value: lte2Rate, name: `2S快开比：${lte2Rate}%` })
      lte5RateArr.push({ value: lte5Rate, name: `5S慢开比：${lte5Rate}%` })
    })
  } catch (e) {
    console.log(e)
    return null
  }

  chartOption.xAxis.data = timeList
  chartOption.series[0] = {
    data: lte1RateArr,
    type: 'line',
    name: '1S快开比',
    smooth: true,
  }
  chartOption.series[1] = {
    data: lte2RateArr,
    type: 'line',
    name: '2S快开比',
    smooth: true,
  }
  chartOption.series[2] = {
    data: lte5RateArr,
    type: 'line',
    name: '5S慢开比',
    smooth: true,
  }

  //时间数据过多时，添加底部滑块
  if (timeList.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }
  return chartOption
}

//获取百分比图表的option
export function getPercentileChartOption(data) {
  //1 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }

  const chartOption = cloneDeep(lineChartOption)
  const timeFormatStr = boardStore.getTimeFormatStr

  const timeList: chartDataValue[] = []
  const pvList: chartDataValue[] = []
  const percentileKeys = Object.keys(data[0]).filter(key => key.includes('p_'))
  const percentileArrs: chartDataValue[][] = Array.from({ length: percentileKeys.length }, () => [])

  try {
    data.forEach(item => {
      timeList.push({
        value: dayjs(item.time).format(timeFormatStr),
        name: item.time,
      })
      percentileKeys.forEach((key, index) => {
        percentileArrs[index].push({
          value: item[key],
          name: `${percentileKeys[index].split('_')[1]}%：<= ${item[key]}ms`,
        })
      })
      pvList.push({ value: item.total, name: `采样PV数：${item.total}` })
    })
  } catch (e) {
    console.log(e)
    return null
  }

  chartOption.xAxis.data = timeList
  // yAxis列表最前面插入一个，用于显示PV数
  chartOption.yAxis.unshift({
    type: 'value',
    axisLabel: {
      formatter: '{value} ms',
    },
    splitLine: {
      show: false,
    },
  })
  chartOption.series[0] = {
    data: pvList,
    type: 'bar',
    yAxisIndex: 1,
    name: '采样PV数',
  }
  // 把percentileArrs中的数据，添加到chartOption.series中
  percentileArrs.forEach((arr, index) => {
    chartOption.series.push({
      name: percentileKeys[index].split('_')[1] + '%',
      data: arr,
      type: 'line',
      smooth: true,
    })
  })

  //时间数据过多时，添加底部滑块
  if (timeList.length > 15) {
    chartOption.dataZoom.show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}
