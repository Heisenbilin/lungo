import { formatDateString } from '../date'
// 按照用户选择的统计维度聚合数据（按时间间隔求和），用于横坐标是时间的图表。
// 要求chartData数组中的board_type一致，仅保留第一项的type。聚合数据项为board_count，会清除board_data
export function dataAggregate(chartData, dimension = 1) {
  if (!Array.isArray(chartData)) {
    // 其他函数有判断是否为数组，这里也加上
    return []
  }
  const mapDimension = {
    1: 'YY-MM-DD',
    2: 'YY-MM-DD HH',
    3: 'YY-MM-DD HH2',
  }
  const dateType = mapDimension[+dimension]
  const aggregatedData = {}
  const tempTime: any[] = [] // 保存格式化后的时间列表
  for (const item of chartData) {
    const time = formatDateString(item.end_time, dateType)
    if (tempTime.includes(time)) {
      aggregatedData[time] += item.board_count
    } else {
      tempTime.push(time)
      aggregatedData[time] = item.board_count
    }
  }
  // 还原数据格式
  const ret: any[] = []
  for (const [k, v] of Object.entries(aggregatedData)) {
    ret.push({
      board_type: chartData[0].board_type,
      board_count: v,
      board_data: '',
      end_time: new Date(k).toISOString(),
    })
  }
  return ret
}

// 聚合数据（按时间间隔求平均），对board_data中的各项数据进行聚合
// 返回处理后的board_data（key变更为时间）
export function dataAggregateAvg(chartData, dimension = 1) {
  if (!Array.isArray(chartData)) {
    return []
  }
  const mapDimension = {
    1: 'YY-MM-DD',
    2: 'YY-MM-DD HH',
    3: 'YY-MM-DD HH2',
  }
  const dateType = mapDimension[+dimension]
  const aggregatedData = {}
  const recordCount = {}
  for (const item of chartData) {
    const boardData = JSON.parse(item.board_data)
    const time = formatDateString(item.end_time, dateType)
    if (recordCount[time]) {
      recordCount[time]++
      for (const subIndex in boardData) {
        aggregatedData[time][subIndex].value += boardData[subIndex].value
      }
    } else {
      recordCount[time] = 1
      aggregatedData[time] = boardData
    }
  }
  for (const [k, v] of Object.entries(aggregatedData)) {
    for (const v2 of v) {
      v2.value = (v2.value / recordCount[k]).toFixed(2)
    }
  }
  return aggregatedData
}

// 聚合数据（求区间总数，不求平均），对board_data中的各项数据进行聚合
// 返回处理后的board_data（key变更为时间）
export function dataAggregateByTime(chartData, timeFormatStr) {
  if (!Array.isArray(chartData)) {
    return {}
  }
  const aggregatedData = {}
  for (const item of chartData) {
    // const boardData = JSON.parse(item.board_data);
    const time = formatDateString(item.end_time, timeFormatStr)
    if (aggregatedData[time]) {
      aggregatedData[time].boardCount += item.board_count
    } else {
      aggregatedData[time] = {
        originTime: item.end_time,
        boardCount: item.board_count,
      }
    }
  }
  return aggregatedData
}

// 聚合数据（求区间总数，不求平均），对board_data中的各项数据进行聚合
// 返回处理后的board_data（key变更为时间）
export function dataAggregateBoardDataByTime(chartData, timeFormatStr) {
  if (!Array.isArray(chartData)) {
    return {}
  }
  const aggregatedData = {}
  for (const item of chartData) {
    const boardData = JSON.parse(item.board_data)
    const time = formatDateString(item.end_time, timeFormatStr)
    if (aggregatedData[time]) {
      Object.keys(boardData).forEach(key => {
        aggregatedData[time].boardData[key] += boardData[key]
      })
    } else {
      aggregatedData[time] = {
        originTime: item.end_time,
        boardData: boardData,
      }
    }
  }
  return aggregatedData
}

const boardDataKeys = {
  dns: ['0 to 15', '15 to 30', '30 to 100', '100 to 100000'],
  fcp: ['0 to 2000', '2000 to 4000', '4000 to 6000', '6000 to 100000'],
  tcp: ['0 to 100', '100 to 200', '200 to 300', '300 to 100000'],
  tti: ['0 to 3800', '3800 to 7300', '7300 to 9000', '9000 to 100000'],
}

// 聚合数据（求区间总数，不求平均），对board_data中的各项数据进行聚合
// 返回处理后的board_data（key变更为时间）
export function dataAggregateBoard2DataByTime(chartData, timeFormatStr, type) {
  if (!Array.isArray(chartData) || !boardDataKeys[type]) {
    return {}
  }
  const aggregatedData = {}
  for (const item of chartData) {
    const time = formatDateString(item.end_time, timeFormatStr)
    if (aggregatedData[time]) {
      aggregatedData[time].boardData[item.board_key] += item.board_count
    } else {
      aggregatedData[time] = {
        originTime: item.end_time,
        boardData: {},
      }
      boardDataKeys[type].forEach(key => {
        aggregatedData[time].boardData[key] = item.board_key === key ? item.board_count : 0
      })
    }
  }
  return aggregatedData
}

// 聚合数据（求区间总数，不求平均），对board_data中的各项数据进行聚合
// 返回处理后的board_data（key变更为时间）
export function aggregateByKey(chartData, key_name, value_name) {
  if (!Array.isArray(chartData)) {
    return {}, []
  }

  const times = new Set()
  const aggregatedData = {}
  for (const item of chartData) {
    times.add(item.time)
    const key = item[key_name]
    const time = item.time
    if (aggregatedData[key]) {
      aggregatedData[key][time] = item[value_name]
    } else {
      aggregatedData[key] = {}
      aggregatedData[key][time] = item[value_name] + (aggregatedData[key][time] || 0)
    }
  }

  return { datas: aggregatedData, times: Array.from(times) }
}
