import { request } from '@vben/request'

enum Api {
  GET_SUMMARY = '/v1/gateway/summary',
  GET_API_RESUT_LIST = '/v1/gateway/apiResultList',
  GET_STATUS_SUMMARY = '/v1/gateway/statusSummary',
  GET_COST_TIME = '/v1/gateway/costTime',
  GET_API_DETAILS = '/v1/gateway/apiDetails',
  GET_CHART_SUMMARY = '/v1/gateway/chartSummary',
  CHECK_VALID_GATEWAY = '/v1/gateway/checkValidGateway',
}

/**
 * @description: GET_SUMMARY
 */

export const getSummary = (params: any) => request.get<any>({ url: Api.GET_SUMMARY, params })

/**
 * @description: GET_API_RESUT_LIST
 */

export const getResultType = (params: any) =>
  request.get<any>({ url: Api.GET_API_RESUT_LIST, params })

/**
 * @description: GET_STATUS_SUMMARY
 */

export const getStatusSummary = (params: any) =>
  request.get<any>({ url: Api.GET_STATUS_SUMMARY, params })

/**
 * @description: GET_COST_TIME
 */

export const getCostTime = (params: any) => request.get<any>({ url: Api.GET_COST_TIME, params })

/**
 * @description: GET_API_DETAILS
 */

export const getApiDetails = (params: any) => request.get<any>({ url: Api.GET_API_DETAILS, params })

/**
 * @description: GET_CHART_SUMMARY
 */

export const getChartSummary = (params: any) =>
  request.get<any>({ url: Api.GET_CHART_SUMMARY, params })

/**
 * @description: CHECK_VALID_GATEWAY
 */

export const checkValidGateway = (params: any) =>
  request.get<any>({ url: Api.CHECK_VALID_GATEWAY, params })
