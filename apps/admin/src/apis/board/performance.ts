import { request } from '@vben/request'
enum Api {
  GET_AVERAGE_DATA = '/v2/performance/avg',
  GET_URL_LIST_DATA = '/v2/performance/list',
  GET_SUMMARY_DATA = '/v2/performance/summary',
  GET_LOG_DETAILS = '/v2/performance/details',
  GET_AVG_CHART_DATA = '/v2/performance/avgChart', //TODO 平均值图表展示
  GET_CONTRAST_DATA = '/v2/performance/contrast', //TODO 快/慢开比数据展示
  GET_SECTION_DATA = '/v2/performance/section', //TODO 时间区间数据展示
  GET_PERCENTILE_DATA = '/v2/performance/percentile', //TODO 百分比数据展示
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
  request.post<any>({ url: Api.GET_AVG_CHART_DATA, params })

/**
 * @description: 获取日志详情数据
 */

export const getLogDetails = (params: any) =>
  request.post<any>({ url: Api.GET_LOG_DETAILS, params })

/**
 * @description: 获取快/慢开比数据
 */

export const getContrastData = (params: any) =>
  request.post<any>({ url: Api.GET_CONTRAST_DATA, params })

/**
 * @description: 获取时间区间数据
 */

export const getSectionData = (params: any) =>
  request.post<any>({ url: Api.GET_SECTION_DATA, params })

/**
 * @description: 获取百分比数据
 */

export const getPercentileData = (params: any) =>
  request.post<any>({ url: Api.GET_PERCENTILE_DATA, params })
