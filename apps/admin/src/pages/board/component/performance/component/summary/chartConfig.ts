import { cloneDeep, formatDateString } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'

const boardStore = useBoardStore()

//图表基础配置
//柱状图与曲线图结合，支持时间范围选择
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
      name: 'PV数',
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
      name: 'PV数',
      barMaxWidth: 40,
    },
  ],
}

const keysConfig = {
  time: { value: [] },
  count: { name: 'PV值', value: [] },
  firstbyte: { name: '首字节', value: [] },
  ready: { name: 'DOM Ready', value: [] },
  pageload: { name: '页面完全加载', value: [] },
  dns: { name: 'DNS', value: [] },
  tcp: { name: 'TCP', value: [] },
  pagessl: { name: 'SSL', value: [] },
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

var latestsSelectedLegend =
  '{"DNS":false,"TCP":false,"SSL":false,"请求响应":false,"内容传输":false,"DOM解析":false,"资源加载":false,"RTT":false,"FCP":false,"FP":false,"RD":false,"TTI":false}'

//获取运行时异常图表的option
export function getSummaryChartOption(data, selectedLegend) {
  //1 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }
  //2 legend变换时，直接返回{}（代表不更新chartOption），echarts底层自动进行图表渲染
  if (latestsSelectedLegend !== JSON.stringify(selectedLegend.selected)) {
    latestsSelectedLegend = JSON.stringify(selectedLegend.selected)
    return {}
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
    value: formatDateString(time, timeFormatStr),
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
  chartOption.legend.selected = selectedLegend.selected
  return chartOption
}
