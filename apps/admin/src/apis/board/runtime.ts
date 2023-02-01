import { request } from '@vben/request'
enum Api {
  GET_SUMMARY_DATA = '/sourcemap/errSummary',
  GET_LIST_DATA = '/sourcemap/runtimeList',
  GET_TOP10_DATA = '/sourcemap/top10',
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
