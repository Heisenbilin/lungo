import { request } from '@vben/request'

enum TaskType {
  TOOL_SENDRULENOTICE = '/tool/sendrulenotice',
  REPORT_GETPROJECTBOARDURL = '/report/getProjectBoardUrl',
  REPORT_GETPRODAYPERFORMANCE = '/report/getProDayPerformance',
  REPORT_GETPROJECTRANKING = '/report/getProjectRanking',
  REPORT_GETERRORTOTALSUMMARY = '/report/getErrorTotalSummary',
  REPORT_GETTWOWEEKSSUMMARY = '/report/getTwoWeeksSummary',
  REPORT_GETERRORSUMMARY = '/report/getErrorSummary',
  REPORT_ERR_SUMMARY = 'report/errSummary',
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
export const reportApis = {
  //发送知音楼企业通知
  sendRuleNotice(data) {
    return request.post({
      url: TaskType.TOOL_SENDRULENOTICE,
      data,
    })
  },
  //获取项目质量周报页面列表
  getList(params) {
    return request.get({
      url: TaskType.REPORT_GETPROJECTBOARDURL,
      params,
    })
  },
  //获得各类性能日趋指标
  getProDayPerformance(params) {
    return request.get({
      url: TaskType.REPORT_GETPRODAYPERFORMANCE,
      params,
    })
  },
  //获得项目评分与排名
  getProjectRanking(params) {
    return request.get({
      url: TaskType.REPORT_GETPROJECTRANKING,
      params,
    })
  },
  //获得项目异常总数
  getErrorTotalSummary(params) {
    return request.get({
      url: TaskType.REPORT_GETERRORTOTALSUMMARY,
      params,
    })
  },
  //获得两周数据 runtime/resource/pv/uv
  getTwoWeeksSummary(params) {
    return request.get({
      url: TaskType.REPORT_GETTWOWEEKSSUMMARY,
      params,
    })
  },
  //获得错误页面top10周报
  getErrorSummary(params) {
    return request.get({
      url: TaskType.REPORT_GETERRORSUMMARY,
      params,
    })
  },
  //获得平均项目性能指标
  getAveragePerformance(params) {
    return request.get({
      url: TaskType.REPORT_GETAVERAGEPERFORMANCE,
      params,
    })
  },
  //获得统计异常信息汇总
  getErrSummary(params) {
    return request.get({
      url: TaskType.REPORT_ERR_SUMMARY,
      params,
    })
  },
  //获取lighthouse建议
  getLighthouseAudits(params) {
    return request.get({
      url: TaskType.LIGHTHOUSE_GET_REPORT,
      params,
    })
  },
  //获得两周平均性能指标
  getTwoWeeksAverage(params) {
    return request.get({
      url: TaskType.REPORT_GET_TWO_WEEKS_AVERAGE,
      params,
    })
  },
  //获得白屏信息
  // /proxy
  getWhiteRate(params) {
    return request.post({
      url: 'https://app.xesv5.com/fire/v1/white/getWhiteRate',
      data: {
        ...params,
      },
    })
  },
  //是否接入容错系统
  checkResourceStatus(params) {
    if (params.project_id == '0') return

    return request.get({
      url: TaskType.REPORT_CHECK_RESOURCE,
      params,
    })
  },
  //是否接入cdn
  checkCDNStatus(params) {
    if (params.project_id == '0') return

    return request.get({
      url: TaskType.REPORT_CHECK_CDN,
      params,
    })
  },
  getProjectLighthouseStatus(params) {
    return request.get({
      url: TaskType.REPORT_GET_PROJECT_LIGHTHOUSE_STATUS,
      params,
    })
  },
  retryLighthouse(params) {
    console.log('params', params)
    return request.get({
      url: TaskType.REPORT_RETRY_LIGHTHOUSE,
      params,
    })
  },
}

/*
 * @description: 获取ua数据
 */

export const getUaChartData = (params: any) =>
  request.post<any>({ url: TaskType.UA_CHARTDATA, params })
