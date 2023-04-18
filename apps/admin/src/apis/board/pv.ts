import { request } from '@vben/request'
enum Api {
  GET_SUMMARY_DATA = '/v2/pageview/summary',
  GET_PAGE_VIEW_DATA = '/v2/pageview/pv',
  GET_URL_LIST_DATA = '/v2/pageview/list',
  GET_BROWSER_DATA = '/v2/monitor/browser',
  GET_DEVICE_DATA = '/v2/monitor/device',
  GET_REGION_DATA = '/v2/monitor/region',
  GET_NETWORK_DATA = '/v2/monitor/network',
  GET_CLIENT_DATA = '/v2/monitor/client',
  GET_RESOLUTION_DATA = '/v2/monitor/resolution', //TODO: 分辨率数据
  GET_OS_DATA = '/v2/monitor/os',
  GET_OPERATOR_DATA = '/v2/monitor/operator', //TODO: 运营商数据
}

/**
 * @description: 获取页面访问概览数据
 */

export const getSummaryData = (params: any) =>
  request.post<any>({ url: Api.GET_SUMMARY_DATA, params })

/**
 * @description: 获取pv数据
 */

export const getPageViewData = (params: any) =>
  request.post<any>({ url: Api.GET_PAGE_VIEW_DATA, params })

/**
 * @description: 获取页面列表
 */

export const getUrlListData = (params: any) =>
  request.post<any>({ url: Api.GET_URL_LIST_DATA, params })

/**
 * @description: 获取浏览器数据
 */

export const getBrowserData = (params: any) =>
  request.post<any>({ url: Api.GET_BROWSER_DATA, params })

/**
 * @description: 获取设备数据
 */

export const getDeviceData = (params: any) =>
  request.post<any>({ url: Api.GET_DEVICE_DATA, params })

/**
 * @description: 获取操作系统数据
 */

export const getOSData = (params: any) => request.post<any>({ url: Api.GET_OS_DATA, params })

/**
 * @description: 获取客户端数据
 */

export const getClientData = (params: any) =>
  request.post<any>({ url: Api.GET_CLIENT_DATA, params })

/**
 * @description: 获取网络数据
 */

export const getNetworkData = (params: any) =>
  request.post<any>({ url: Api.GET_NETWORK_DATA, params })

/**
 * @description: 获取地区数据
 */

export const getRegionData = (params: any) =>
  request.post<any>({ url: Api.GET_REGION_DATA, params })

/**
 * @description: 获取分辨率数据
 */

export const getResolutionData = (params: any) =>
  request.post<any>({ url: Api.GET_RESOLUTION_DATA, params })