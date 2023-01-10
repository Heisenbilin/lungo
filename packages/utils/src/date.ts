import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export const dateUtil = dayjs

export const formatToDateTime = (date: ConfigType, format = DATE_TIME_FORMAT): string => {
  return dateUtil(date).format(format)
}

export const formatToDate = (date: ConfigType, format = DATE_FORMAT): string => {
  return dateUtil(date).format(format)
}

/**
 *
 * @param {number} time
 * @returns 2019/12/01 12:00:00
 */
export function handleDate({ time, type }) {
  let date = time
  if (date.toString().indexOf('GMT') == -1) {
    date = new Date(time)
  }
  //小时
  const hour = date.getHours()
  const hourName = hour < 10 ? `0${hour}` : hour

  // 分钟
  const minute = date.getMinutes()
  const minuteName = minute < 10 ? `0${minute}` : minute

  // 秒
  const second = date.getSeconds()
  const secondName = second < 10 ? `0${second}` : second

  // 日
  const day = date.getDate()
  const dayName = day < 10 ? `0${day}` : day

  // 月
  const month = date.getMonth() + 1
  const monthName = month < 10 ? `0${month}` : month

  // 年
  const year = date.getFullYear()

  let dateTime = ''
  if (type === 'YY-MM-DD HH-mm-ss') {
    dateTime = `${year}/${monthName}/${dayName} ${hourName}:${minuteName}:${secondName}`
  }
  if (type === 'YY-MM-DD HH-mm') {
    dateTime = `${year}/${monthName}/${dayName} ${hourName}:${minuteName}`
  }
  if (type === 'YY-MM-DD') {
    dateTime = `${year}-${monthName}-${dayName}`
  }
  if (type === 'YY-MM-DD HH') {
    dateTime = `${year}-${monthName}-${dayName} ${hourName}:00`
  }
  return dateTime
}

/**
 *
 * @param {string} time 时间字符串
 * @param {string} type 格式化标识
 * @returns 2019/12/01 12:00:00
 */
export function formatDateString(time, type) {
  if (!time) {
    return ''
  }
  //若为2018-10-10这样的字符串，new Date默认hour为8 ，改为2018/10/10默认为0
  if (time.length === 10) {
    time = time.replace(/-/g, '/')
  }
  let date = time
  if (date.toString().indexOf('GMT') === -1) {
    date = new Date(time)
  }
  //小时
  const hour = date.getHours()
  const hourName = hour < 10 ? `0${hour}` : hour

  // 分钟
  const minute = date.getMinutes()
  const minuteName = minute < 10 ? `0${minute}` : minute
  const minuteCount = parseInt(`${minute / 10}`) * 10
  const tenMinute = minuteCount < 30 ? `00` : 30

  // 秒
  const second = date.getSeconds()
  const secondName = second < 10 ? `0${second}` : second

  // 日
  const day = date.getDate()
  const dayName = day < 10 ? `0${day}` : day

  // 月
  const month = date.getMonth() + 1
  const monthName = month < 10 ? `0${month}` : month

  // 年
  const year = date.getFullYear()

  let dateTime = ''
  if (type === 'YY-MM-DD HH-mm-ss') {
    dateTime = `${year}-${monthName}-${dayName} ${hourName}:${minuteName}:${secondName}`
  } else if (type === 'YY-MM-DD HH-mm') {
    dateTime = `${year}-${monthName}-${dayName} ${hourName}:${minuteName}`
  } else if (type === 'YY-MM-DD') {
    dateTime = `${year}-${monthName}-${dayName}`
  } else if (type === 'mm-dd') {
    dateTime = `${monthName}-${dayName}`
  } else if (type === 'YY-MM-DD HH') {
    dateTime = `${year}-${monthName}-${dayName} ${hourName}:00`
  } else if (type === 'YY-MM-DD HH2') {
    dateTime = `${year}-${monthName}-${dayName} ${hourName}:${tenMinute}`
  } else if (type === 'mm-dd HH') {
    dateTime = `${monthName}-${dayName} ${hourName}:00`
  } else if (type === 'mm-dd HH2') {
    dateTime = `${monthName}-${dayName} ${hourName}:${tenMinute}`
  } else if (type === 'HH') {
    dateTime = `${hourName}:00`
  } else if (type === 'HH2') {
    dateTime = `${hourName}:${tenMinute}`
  }
  return dateTime
}

export function getDateWeekday(date, chinese = true) {
  const dateTime = dayjs(date)
  if (dateTime.isValid()) {
    switch (dateTime.day()) {
      case 0:
        return chinese ? '周日' : 1
      case 1:
        return chinese ? '周一' : 2
      case 2:
        return chinese ? '周二' : 3
      case 3:
        return chinese ? '周三' : 4
      case 4:
        return chinese ? '周四' : 5
      case 5:
        return chinese ? '周五' : 6
      case 6:
        return chinese ? '周六' : 7
    }
  }
  return ''
}

// function converTime(timeString) {
//   return new Date(new Date(timeString).getTime() + 8 * 60 * 60 * 1000);
// }

//获取最近day天日期

export function getDay(day) {
  var today = new Date()

  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day

  today.setTime(targetday_milliseconds) //注意，这行是关键代码

  var tYear = today.getFullYear()

  var tMonth = today.getMonth()

  var tDate = today.getDate()

  tMonth = doHandleMonth(tMonth + 1)

  tDate = doHandleMonth(tDate)

  return tYear + '-' + tMonth + '-' + tDate
}

function doHandleMonth(month) {
  var m = month

  if (month.toString().length == 1) {
    m = '0' + month
  }

  return m
}
