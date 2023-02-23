import { request } from '@vben/request'
enum Api {
  GET_AVERAGE_DATA = '/performance/average',
  GET_URL_LIST_DATA = '/performance/list',
  GET_CHART_SUMMARY_DATA = '/performance/chartSummary',
  GET_LOG_DETAILS = '/performance/details',
}

/**
 * @description: 获取平均数据
 */

export const getAverageData = (params: any) =>
  request.post<any>({ url: Api.GET_AVERAGE_DATA, params })

/**
 * @description: 获取页面列表数据
 */

export const getUrlListData = (params: any) =>
  request.post<any>({ url: Api.GET_URL_LIST_DATA, params })

/**
 * @description: 获取性能表格汇总数据
 */

export const getChartSummaryData = (params: any) =>
  request.post<any>({ url: Api.GET_CHART_SUMMARY_DATA, params })

/**
 * @description: 获取日志详情数据
 */

export const getLogDetails = (params: any) => request.get<any>({ url: Api.GET_LOG_DETAILS, params })
