/*
 *为数字或字符串添加千分位
 */
export function commafy(num) {
  if (num == null) {
    return ''
  }
  return (num + '').replace(/\B(?=(\d{3})+\b)/g, ',')
}

/**
 * ms转大单位
 * Converts a time in milliseconds into a duration string, i.e. `1d 2h 13m 52s`
 * @param {number} timeInMilliseconds
 * @return {string}
 */
export function formatDuration(timeInMilliseconds) {
  console.log(timeInMilliseconds)
  let timeInSeconds = timeInMilliseconds / 1000
  if (Math.round(timeInSeconds) === 0) {
    return 'None'
  }

  /** @type {Array<string>} */
  const parts: string[] = []
  /** @type {Record<string, number>} */
  const unitLabels = {
    d: 60 * 60 * 24,
    h: 60 * 60,
    m: 60,
    s: 1,
  }

  Object.keys(unitLabels).forEach(label => {
    const unit = unitLabels[label]
    const numberOfUnits = Math.floor(timeInSeconds / unit)
    if (numberOfUnits > 0) {
      timeInSeconds -= numberOfUnits * unit
      parts.push(`${numberOfUnits}\xa0${label}`)
    }
  })

  return parts.join(' ')
}

// 将数组转换为和为100的百分比
// 传入参数（数组数据，精度）
export function getPercentValue(valueList, precision) {
  const sum = valueList.reduce(function (acc, val) {
    return acc + (isNaN(val) ? 0 : val)
  }, 0)
  if (sum === 0) {
    return new Array(valueList.length).fill(0)
  }
  // 10的2次幂是100，用于计算精度。
  const digits = Math.pow(10, precision)
  // 扩大比例100，
  const votesPerQuota = valueList.map(function (val) {
    return ((isNaN(val) ? 0 : val) / sum) * digits * 100
  })
  // 总数，扩大比例意味的总数要扩大
  const targetSeats = digits * 100
  // 再向下取值，组成数组
  const seats = votesPerQuota.map(function (votes) {
    return Math.floor(votes)
  })
  // 再新计算合计，用于判断与总数量是否相同，相同则占比会100%
  let currentSum = seats.reduce(function (acc, val) {
    return acc + val
  }, 0)
  // 余数部分的数组：原先数组减去向下取值的数组，得到余数部分的数组
  const remainder = votesPerQuota.map(function (votes, idx) {
    return votes - seats[idx]
  })
  // 给最大最大的余额加1，凑个占比100%；
  while (currentSum < targetSeats) {
    //  找到下一个最大的余额，给其加1
    let max = Number.NEGATIVE_INFINITY
    let maxId = 0
    for (let i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max) {
        max = remainder[i]
        maxId = i
      }
    }
    // 对最大项余额加1
    ++seats[maxId]
    // 已经增加最大余数加1，则下次判断就可以不需要再判断这个余额数。
    remainder[maxId] = 0
    // 总的也要加1，为了判断是否总数是否相同，跳出循环。
    ++currentSum
  }
  // 这时候的seats就会总数占比会100%
  return seats.map(item => item / 100)
}
