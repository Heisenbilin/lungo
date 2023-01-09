import { cloneDeep } from '@vben/utils'
import { graphic } from '@vben/hooks'
const linearGradient = graphic.LinearGradient

const defaultOption: any = {
  grid: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  xAxis: {
    show: false,
    data: ['1', '2'],
  },
  yAxis: {
    show: false,
  },
  series: [
    {
      data: [0, 0],
      type: 'line',
      sampling: 'lttb',
      symbol: 'none',
      itemStyle: {
        color: '#f77f00',
      },
      areaStyle: {
        color: new linearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#f77f00',
          },
          {
            offset: 1,
            color: '#fff',
          },
        ]),
      },
    },
  ],
}

export const getTendencyChartOption = data => {
  const chartOption = cloneDeep(defaultOption)
  if (!(Array.isArray(data) && data.length)) return chartOption
  const timeList = data.length === 1 ? ['1'] : []
  const countList = data.length === 1 ? [0] : []
  data.forEach(item => {
    timeList.push(item.query_time)
    countList.push(item.board_count)
  })
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  return chartOption
}
