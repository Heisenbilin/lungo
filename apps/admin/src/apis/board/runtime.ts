import { request } from '@vben/request'
enum Api {
  GET_SUMMARY_DATA = '/v2/runtime/errSummary',
  GET_LIST_DATA = '/v2/runtime/list',
  GET_TOP10_DATA = '/v2/runtime/top10',
  GET_DETAILS_DATA = '/v2/runtime/details', //TODO：详情数据展示
  GET_CHART_DATA = '/v2/runtime/chart', //TODO：图表数据展示
}

/**
 * @description: 获取运行时异常汇总数据
 */

export const getSummaryData = (params: any) =>
  request.post<any>({ url: Api.GET_SUMMARY_DATA, params })

/**
 * @description: 获取列表数据
 */

export const getListData = (params: any) => request.post<any>({ url: Api.GET_LIST_DATA, params })

/**
 * @description: 获取异常Top10数据
 */

export const getTop10Data = (params: any) => request.post<any>({ url: Api.GET_TOP10_DATA, params })

/**
 * @description: 获取异常详情数据
 */
export const getRuntimeErrorDetails = (params: any) =>
  request.post<any>({ url: Api.GET_DETAILS_DATA, params })

/**
 * @description: 获取图表数据
 */
export const getChartData = (params: any) => request.post<any>({ url: Api.GET_CHART_DATA, params })
