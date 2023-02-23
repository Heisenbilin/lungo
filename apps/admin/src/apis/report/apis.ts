import { cloneDeep } from '@vben/utils'
import { request } from '@vben/request'

enum TaskType {
  TOOL_SENDRULENOTICE = '/tool/sendrulenotice',
  REPORT_GETPROJECTBOARDURL = '/report/getProjectBoardUrl',
  REPORT_GETPRODAYPERFORMANCE = '/report/getProDayPerformance',
  REPORT_GETPROJECTRANKING = '/report/getProjectRanking',
  REPORT_GETERRORTOTALSUMMARY = '/report/getErrorTotalSummary',
  REPORT_GETTWOWEEKSSUMMARY = '/report/getTwoWeeksSummary',
  REPORT_GETERRORSUMMARY = '/report/getErrorSummary',
  REPORT_ERR_SUMMARY = '/report/errSummary',
  LIGHTHOUSE_GET_REPORT = '/lighthouse/getReport',
  REPORT_GETAVERAGEPERFORMANCE = '/report/getAveragePerformance',
  REPORT_GET_TWO_WEEKS_AVERAGE = '/report/getTwoWeeksAverage',
  REPORT_CHECK_RESOURCE = '/report/checkResource',
  REPORT_CHECK_CDN = '/report/checkCDN',
  REPORT_GET_PROJECT_LIGHTHOUSE_STATUS = '/report/getProjectLighthouseStatus',
  REPORT_RETRY_LIGHTHOUSE = '/report/retryLighthouse',
  UA_CHARTDATA = '/ua/chartdata',
}

//质量周报相关接口

//获得两周平均性能指标
export const  getTwoWeeksAverage = (params:any) =>{
  return request.get({
      url: TaskType.REPORT_GET_TWO_WEEKS_AVERAGE,
      params,
  })
}
 //获得项目评分与排名
export const  getProjectRanking=(params) =>{
      return request.get({
        url: TaskType.REPORT_GETPROJECTRANKING,
        params,
      })
}
 //获取项目质量周报页面列表
export const  getListById =(params) =>{
    return request.get({
      url: TaskType.REPORT_GETPROJECTBOARDURL,
      params,
    })
}
  //获得各类性能日趋指标
export const getProDayPerformance = (params) =>{
  return request.get({
    url: TaskType.REPORT_GETPRODAYPERFORMANCE,
    params,
  })
}

  //获取lighthouse建议
export const getLighthouseAudits =(params) =>{
  return request.get({
    url: TaskType.LIGHTHOUSE_GET_REPORT,
    params,
  })
}


//获得平均项目性能指标
export async function getAveragePerformance(params) {
  return request.get({
    url: TaskType.REPORT_GETAVERAGEPERFORMANCE,
    params,
  })
}
 //获得统计异常信息汇总
export const  getErrSummary = (params) =>{
  return request.get({
    url: TaskType.REPORT_ERR_SUMMARY,
    params,
  })
}
  //获得白屏信息
  // /proxy
export async function getWhiteRate(params) {
  return request.post({
    url: 'https://app.xesv5.com/fire/v1/white/getWhiteRate',
    data: {
      ...params,
    },
  })
}

export const getProjectLighthouseStatus = (params)=> {
  return request.get({
    url: TaskType.REPORT_GET_PROJECT_LIGHTHOUSE_STATUS,
    params,
  })
}
export const  retryLighthouse=(params)=> {
  return request.get({
    url: TaskType.REPORT_RETRY_LIGHTHOUSE,
    params,
  })
}

//发送知音楼企业通知
export const  sendRuleNotice = (data)=> {
  return request.post({
    url: TaskType.TOOL_SENDRULENOTICE,
    data,
  })
}
  //获得项目异常总数
 export const getErrorTotalSummary=(params) =>{
    return request.get({
      url: TaskType.REPORT_GETERRORTOTALSUMMARY,
      params,
    })
  }
    //获得两周数据 runtime/resource/pv/uv
export const  getTwoWeeksSummary=(params) =>{
      return request.get({
        url: TaskType.REPORT_GETTWOWEEKSSUMMARY,
        params,
      })
    }
  //获得错误页面top10周报
export const  getErrorSummary=(params)=> {
    return request.get({
      url: TaskType.REPORT_GETERRORSUMMARY,
      params,
    })
  }

  //是否接入容错系统
 export const  checkResourceStatus =(params)=> {
    if (params.project_id == '0') return

    return request.get({
      url: TaskType.REPORT_CHECK_RESOURCE,
      params,
    })
  }
  //是否接入cdn
export const  checkCDNStatus=(params)=> {
    if (params.project_id == '0') return
    return request.get({
      url: TaskType.REPORT_CHECK_CDN,
      params,
    })
  }
/*
 * @description: 获取ua数据
 */
export const getUaChartData = (params: any) =>
  request.post<any>({ url: TaskType.UA_CHARTDATA, params })


export function getPVUVOptions(data, option) {
  const opt = cloneDeep(option)
  opt.series[0].data = data[0]
  opt.series[1].data = data[1]
  return opt
}

export function getUAOptions(data, option) {
  const opt = cloneDeep(option)
  opt.series[0].data = data
  return opt
}

export function getUAVersionOptions(data, option) {
  const opt = cloneDeep(option)
  opt.yAxis.data = data[0]
  opt.legend.data = data[1]
  for (let i = 0; i < data[2].length; i++) {
    opt.series.push({
      name: data[1][i],
      type: 'bar',
      stack: 'total',
      data: data[2][i],
    })
  }
  return opt
}

export function getCountOptions(data, option) {
  const opt = cloneDeep(option)
  opt.series[0].data = data[0]
  opt.series[1].data = data[1]
  return opt
}
