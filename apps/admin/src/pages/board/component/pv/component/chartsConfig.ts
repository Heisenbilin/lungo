import { cloneDeep, commafy } from '@vben/utils'
import dayjs from 'dayjs'

//“PV”与“UV”图表基础配置
const PVUVChartConfig: any = {
  xAxis: {
    boundaryGap: false,
    axisTick: {
      show: false,
    },
    data: [],
  },
  grid: {
    top: 20,
    left: '2%',
    right: '3%',
    bottom: '3%',
    containLabel: true,
  },
  legend: {},
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    formatter: item => {
      return `<font style="color:green">${item[0]?.data.name}</font><br/>
                访问次数-PV：${commafy(item[0].value)}<br/>
                访问用户数-UV：${commafy(item[1].value)}<br/>
                单击添加<font style="color:green">${item?.[0].data.name}</font>为筛选条件`
    },
  },
  yAxis: {
    axisTick: {
      show: false,
    },
    type: 'value',
  },
  dataZoom: [
    {
      type: 'slider',
      start: 0,
      end: 100,
      show: false,
    },
  ],
  series: [
    {
      name: '访问次数-PV',
      data: [],
      type: 'line',
      animation: false,
    },
    {
      name: '访问用户数-UV',
      data: [],
      type: 'line',
      animation: false,
    },
  ],
}

//将接口返回值处理成“状态码”图表数据
export function getPVUVChartOption(data, timeFormatStr) {
  if (!Array.isArray(data) || data.length === 0) {
    return null
  }

  const chartOption = cloneDeep(PVUVChartConfig)
  let timeList: any[] = [] //时间数据
  let pvList: any[] = [] //异常数
  let uvList: any[] = [] //异常数
  data.forEach(item => {
    const formatTime = dayjs(item.time).format(timeFormatStr)
    timeList.push({ value: formatTime, name: item.time })
    pvList.push({
      value: item.pv,
      name: formatTime,
    })
    uvList.push({ value: item.uv })
  })
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = pvList
  chartOption.series[1].data = uvList

  if (timeList.length > 20) {
    chartOption.dataZoom[0].show = true
    chartOption.grid.bottom = '15%'
  }

  return chartOption
}
