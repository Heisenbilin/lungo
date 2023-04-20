import { cloneDeep, commafy } from '@vben/utils'
import { barChartOption } from '@vben/constants'
import { type chartDataValue } from '@vben/types'

//获取百分比图表的option
export function getSectionChartOption(data) {
  //1 数据为空时，返回null，图表为空状态
  if (!(Array.isArray(data) && data.length)) {
    return null
  }

  const chartOption = cloneDeep(barChartOption)
  const costList: chartDataValue[] = []
  const pvList: chartDataValue[] = []

  try {
    data.forEach(item => {
      costList.push({ value: item.key + 's' })
      pvList.push({ value: item.count, name: `采样PV数：${commafy(item.count)}` })
    })
  } catch (e) {
    console.log(e)
    return null
  }

  chartOption.xAxis.data = costList
  chartOption.series[0].data = pvList

  return chartOption
}
