import { accSub, accMul, accDiv, cloneDeep } from '@vben/utils' //accAdd,
import { useAppTheme } from '@vben/hooks'

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

export function getUrlErrorOptions(data, score) {
  if (!(Array.isArray(data.data) && data.data.length)) {
    return null
  }
  return {
    tooltip: {
      trigger: 'item',
    },
    color: [score < 50 ? '#EC5C4C' : score < 75 ? '#F3A73B' : '#5ECA75'],
    legend: {
      orient: 'vertical',
      right: 10,
      top: 20,
    },
    series: [
      {
        name: '异常分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          color: '#4c4a4a',
          formatter: '{total|' + score + '分}',
          rich: {
            total: {
              fontSize: 35,
              fontFamily: '微软雅黑',
              color: '#454c5c',
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  }
}

// export const getProDayChartOption = data => {
//   const chartOption = cloneDeep(defaultTwoWeeksOption)

//   chartOption.series[0].data = data.lastWeek[type]
//   chartOption.series[1].data = data.currentWeek[type]

//   return chartOption
// }
