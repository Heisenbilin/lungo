import { accSub, accMul, accDiv, cloneDeep } from '@vben/utils' //accAdd,

const lineChartOption: any = {
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
  yAxis: {
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
  series: [],
}

export function getProOptions(data) {
  if (!(Array.isArray(data.data) && data.data.length)) {
    return null
  }
  const chartOption = cloneDeep(lineChartOption)
  chartOption.series = data.data.map(item => ({
    name: item.type,
    type: 'line',
    data: item.average,
  }))
  chartOption.xAxis.data = data.time
  return chartOption
}

export function getScore(num) {
  if (num === 0) return 100
  if (num > 5) return 0
  if (num < 1) {
    return accSub(100, accMul(25, num))
  }
  if (num >= 1 && num < 3) {
    return accSub(75, accMul(25, accDiv(accSub(num, 1), 2)))
  }
  if (num >= 3) {
    return accSub(50, accMul(25, accSub(num, 3)))
  }
  return 0
}

// export const getProDayChartOption = data => {
//   const chartOption = cloneDeep(defaultTwoWeeksOption)

//   chartOption.series[0].data = data.lastWeek[type]
//   chartOption.series[1].data = data.currentWeek[type]

//   return chartOption
// }

export const PERFORMANCE_INDEX = [
  {
    name: 'DNS 域名解析时间',
    rule: 'domainLookupEnd - domainLookupStart',
    weight: '5%',
    low: '>30ms',
    middle: '15–30ms',
    high: '0–15ms',
  },
  {
    name: 'TCP 连接时间',
    rule: 'connectEnd - connectStart',
    weight: '5%',
    low: '>300ms',
    middle: '100–200ms',
    high: '0–100ms',
  },
  {
    name: 'TTFB',
    rule: 'responseStart - requestStart',
    weight: '15%',
    low: '>500ms',
    middle: '300–500ms',
    high: '0–300ms',
  },
  {
    name: 'FP 第一个像素渲染时间',
    rule: 'getEntries：name === first-paint',
    weight: '25%',
    low: '>4000ms',
    middle: '2000–4000ms',
    high: '0–2000ms',
  },
  {
    name: 'TTI',
    rule: 'domInteractive - fetchStart',
    weight: '5%',
    low: '>7300ms',
    middle: '3800–7300ms',
    high: '0–3800ms',
  },
  {
    name: 'FCP',
    rule: 'first-contentful-paint',
    weight: '5%',
    low: '>4000ms',
    middle: '2000–4000ms',
    high: '0–2000ms',
  },
]

export const PERFORMANCE_COLUMNS = [
  {
    title: '指标项',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '计算规则',
    dataIndex: 'rule',
    key: 'rule',
    align: 'rule',
  },
  {
    title: '权重',
    dataIndex: 'weight',
    key: 'weight',
    align: 'center',
  },
  {
    title: '0~50分',
    dataIndex: 'low',
    key: 'low',
    align: 'center',
  },
  {
    title: '50～75分',
    dataIndex: 'middle',
    key: 'middle',
    align: 'center',
  },
  {
    title: '75~100分',
    dataIndex: 'high',
    key: 'high',
    align: 'center',
  },
]

export const STABILITY_INDEX = [
  {
    name: '运行时异常',
    low: '>3%',
    middle: '1-3%',
    high: '0-1%',
  },
  {
    name: '资源异常',
    low: '>3%',
    middle: '1-3%',
    high: '0-1%',
  },
  {
    name: '白屏异常',
    low: '>3%',
    middle: '1-3%',
    high: '0-1%',
  },
]

export const STABILITY_COLUMNS = [
  {
    title: '指标项',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '0~50分',
    dataIndex: 'low',
    key: 'low',
    align: 'center',
  },
  {
    title: '50～75分',
    dataIndex: 'middle',
    key: 'middle',
    align: 'center',
  },
  {
    title: '75~100分',
    dataIndex: 'high',
    key: 'high',
    align: 'center',
  },
]
