import { request } from '@vben/request'

enum TaskType {
  GET_OS_REPORT = '/v2/report/os',
  GET_BROWSER_REPORT = '/v2/report/browser',
  GET_REGION_REPORT = '/v2/report/region',
  GET_RUNTIME_TOP_REPORT = '/v2/report/top/runtime',
  GET_RESOURCE_TOP_REPORT = '/v2/report/top/resource',
  GET_RESOURCE_URL_REPORT = '/v2/report/top/resourceUrl',
  GET_RUNTIME_URL_REPORT = '/v2/report/top/runtimeUrl',
  GET_INTERFACE_TOP_REPORT = '/v2/report/top/interface',
  GET_COSTTIME_REPORT = '/v2/report/top/costTime',
  GET_TWO_WEEKS_SUMMARY_REPORT = '/v2/report/getTwoWeeksSummary',
  GET_TWO_WEEKS_PERFORMANCE_BOARD_DATA_REPORT = '/v2/report/getTwoWeeksPerformanceBoardData',
  GET_AVERAGE_PERFORMANCE_REPORT = '/v2/report/getAveragePerformance',
  GET_STABILITY_REPORT = '/v2/report/getStability',
  GET_PRO_DAY_PERFORMANCE_REPORT = '/v2/report/getProDayPerformance',
  GET_PROJECT_RANKING_REPORT = '/v2/report/getProjectRanking',
  GET_LIGHHOUSE_REPORT = '/v2/lighthouse/getReport',
  GET_PROJECT_LIGHHOUSE_STATUS = '/v2/report/getProjectLighthouseStatus',
  GET_PROJECT_BOARD_URL = '/v2/report/getProjectBoardUrl',
}

//质量周报相关接口

//获得平均性能指标
export const getAveragePerformanceReport = (params: any) => {
  return request.get({
    url: TaskType.GET_AVERAGE_PERFORMANCE_REPORT,
    params,
  })
}
//获得项目评分与排名
export const getProjectRanking = params => {
  return request.get({
    url: TaskType.GET_PROJECT_RANKING_REPORT,
    params,
  })
}
//获取系统信息周报
export const getOsReport = params => {
  return request.get({
    url: TaskType.GET_OS_REPORT,
    params,
  })
}
//获取浏览器信息周报
export const getBrowserReport = params => {
  return request.get({
    url: TaskType.GET_BROWSER_REPORT,
    params,
  })
}
//获取地区信息周报
export const getRegionReport = params => {
  return request.get({
    url: TaskType.GET_REGION_REPORT,
    params,
  })
}
//获取运行时信息周报
export const getRuntimeTopReport = params => {
  return request.get({
    url: TaskType.GET_RUNTIME_TOP_REPORT,
    params,
  })
}
//获取资源信息周报
export const getResourceTopReport = params => {
  return request.get({
    url: TaskType.GET_RESOURCE_TOP_REPORT,
    params,
  })
}
//获取资源url信息周报
export const getResourceUrlReport = params => {
  return request.get({
    url: TaskType.GET_RESOURCE_URL_REPORT,
    params,
  })
}
//获取运行时url信息周报
export const getRuntimeUrlReport = params => {
  return request.get({
    url: TaskType.GET_RUNTIME_URL_REPORT,
    params,
  })
}
//获取接口信息周报
export const getInterfaceTopReport = params => {
  return request.get({
    url: TaskType.GET_INTERFACE_TOP_REPORT,
    params,
  })
}
//获取耗时信息周报
export const getCostTimeReport = params => {
  return request.get({
    url: TaskType.GET_COSTTIME_REPORT,
    params,
  })
}
//获取两周概览信息
export const getTwoWeeksSummaryReport = params => {
  return request.get({
    url: TaskType.GET_TWO_WEEKS_SUMMARY_REPORT,
    params,
  })
}
//获取两周性能看板数据
export const getTwoWeeksPerformanceBoardDataReport = params => {
  return request.get({
    url: TaskType.GET_TWO_WEEKS_PERFORMANCE_BOARD_DATA_REPORT,
    params,
  })
}
//获取稳定性信息
export const getStabilityReport = params => {
  return request.get({
    url: TaskType.GET_STABILITY_REPORT,
    params,
  })
}
//获取项目每日性能信息
export const getProDayPerformanceReport = params => {
  return request.get({
    url: TaskType.GET_PRO_DAY_PERFORMANCE_REPORT,
    params,
  })
}
//获取项目lighthouse报告
export const getLighthouseReport = params => {
  return request.get({
    url: TaskType.GET_LIGHHOUSE_REPORT,
    params,
  })
}
//获取项目lighthouse状态
export const getProjectLighthouseStatus = params => {
  return request.get({
    url: TaskType.GET_PROJECT_LIGHHOUSE_STATUS,
    params,
  })
}
//获取项目看板url
export const getProjectBoardUrl = params => {
  return request.get({
    url: TaskType.GET_PROJECT_BOARD_URL,
    params,
  })
}
