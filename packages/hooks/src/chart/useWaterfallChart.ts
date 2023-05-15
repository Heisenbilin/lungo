import { cloneDeep, accAdd, accSub, commafy } from '@vben/utils'

//性能优良差标准的阈值
const performanceStandards = {
  dns: [15, 30, 100],
  tcp: [100, 200, 300],
  ssl: [15, 30, 100],
  ttfb: [300, 500, 700],
  trans: [100, 200, 300],
  dom: [3800, 7300, 9000],
  res: [300, 500, 700],
}

const performanceRules = {
  dns: 't.domainLookupEnd - t.domainLookupStart',
  tcp: 't.connectEnd - t.connectStart',
  ssl: 't.connectEnd - t.secureConnectionStart',
  ttfb: 't.responseStart - t.requestStart',
  trans: 't.responseEnd - t.responseStart',
  dom: 't.domInteractive - t.responseEnd',
  res: 't.loadEventStart - t.domContentLoadedEventEnd',
}

//瀑布图基础配置
const waterfallChartOption: any = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: params => {
      const tar = params[1]
      const standard = performanceStandards[tar.name]
      const color = getColor(standard, tar.value)
      return `${tar.axisValue}<br/>
      ${tar.seriesName}: <span style="color:${color}">${tar.value}ms</span><br/>
      <span style="color:green">优</span>：0-${standard[0]}ms;
      <span style="color:orange">良</span>：${standard[0]}-${standard[1]}ms;
      <span style="color:red">差</span>：>${standard[1]}ms<br/>
      计算规则：${performanceRules[tar.name]}`
    },
  },
  grid: {
    left: '-162',
    right: '',
    bottom: '',
    top: '10%',
    containLabel: true,
  },
  // tooltip: { show: false },
  xAxis: { show: false },
  yAxis: [
    {
      type: 'category',
      splitLine: { show: false },
      data: [
        '资源加载 Resource Download',
        'DOM解析 DOM Parse',
        '内容传输 Content Download',
        '请求响应 Waiting(TTFB)',
        'SSL建连 SSL',
        'TCP连接 Initial Connection',
        'DNS查询 DNS Lookup',
      ],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: 165,
        align: 'left',
      },
    },
    {
      splitLine: { show: false },
      data: [],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: 10,
        align: 'right',
        formatter: item => `${commafy(item)}ms`,
      },
    },
  ],
  series: [
    {
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent',
      },
    },
    {
      name: '耗时',
      type: 'bar',
      stack: 'Total',
    },
  ],
}

export const useWaterfallChartOption = data => {
  const chartOption = cloneDeep(waterfallChartOption)
  const color = ['#a2d2ff', '#bde0fe', '#ffafcc', '#ffc8dd', '#cdb4db', '#bdb2ff', '#a0c4ff']
  var sum = 0
  const performanceKeys = ['dns', 'tcp', 'ssl', 'ttfb', 'trans', 'dom', 'res']
  const arr: [any[], any[], any[]] = [[], [], []]
  performanceKeys.forEach(key => {
    //考虑到数据差值，这里进行补齐
    if (key === 'trans') sum = data.firstbyte || 0
    if (key === 'res') sum = data.ready || 0
    //存入数据到暂存数组中
    arr[1].unshift({
      name: key,
      value: data[key] || 0,
      itemStyle: { color: color.shift() },
    })
    arr[2].unshift({
      value: data[key] || 0,
      textStyle: {
        color: getColor(performanceStandards[key], data[key] || 0), //根据标准动态设置颜色
      },
    })
    if (key === 'ssl') {
      arr[0].unshift(accSub(sum, data[key] || 0))
    } else {
      arr[0].unshift(sum)
      sum = accAdd(sum, data[key] || 0)
    }
  })

  chartOption.series[0].data = arr[0]
  chartOption.series[1].data = arr[1]
  chartOption.yAxis[1].data = arr[2]
  const lineList: any[] = []
  if (data.firstbyte) {
    lineList.push({ name: `首字节`, xAxis: data.firstbyte })
  }
  if (data.ready) {
    lineList.push({ name: `DOM Ready`, xAxis: data.ready, label: { lineHeight: 40 } })
  }
  if (data.load) {
    lineList.push({ name: `完全加载`, xAxis: data.load })
  }
  if (lineList.length) {
    chartOption.series[1].markLine = {
      data: lineList,
      symbol: ['none', 'none'],
      label: {
        formatter: item => `${item.name}：${commafy(item.value)}ms`,
      },
    }
  }
  chartOption.xAxis.max = data.load
  return chartOption
}

const colors = ['green', 'orange', 'red']

const getColor = (standard, value) => {
  for (let i = 0; i < 3; i++) {
    if (value < standard[i]) {
      return colors[i]
    }
  }
  return colors[2]
}

export const useDataToWaterfallChartOption = data => {
  if (!data || !(typeof data === 'object' && Object.keys(data).length)) {
    return null
  }
  return useWaterfallChartOption(data)
}
