import { request } from '@vben/request'
enum Api {
  GET_PAGE_VIEW_DATA = '/pageview/pv',
  GET_USER_VIEW_DATA = '/pageview/uv',
  GET_URL_LIST_DATA = '/pageview/getUrlList',
  GET_BROWSER_DATA = '/pageview/browser',
  GET_DEVICE_DATA = '/pageview/device',
  GET_OS_DATA = '/pageview/os',
  GET_CLIENT_DATA = '/pageview/client',
  GET_NETWORK_DATA = '/pageview/network',
  GET_REGION_DATA = '/pageview/region',
}

/**
 * @description: 获取pv数据
 */

export const getPageViewData = (params: any) =>
  request.post<any>({ url: Api.GET_PAGE_VIEW_DATA, params })

/**
 * @description: 获取uv数据
 */

export const getUserViewData = (params: any) =>
  request.post<any>({ url: Api.GET_USER_VIEW_DATA, params })

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
