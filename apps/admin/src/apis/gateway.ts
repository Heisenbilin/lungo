import { request } from '@vben/request'

enum Api {
  GET_SUMMARY = '/gateway/summary',
  GET_API_RESUT_LIST= '/gateway/apiResultList',
  GET_STATUS_SUMMARY = '/gateway/statusSummary',
  GET_COST_TIME = '/gateway/costTime',
  GET_API_DETAILS = '/gateway/apiDetails',
  GET_CHART_SUMMARY = '/gateway/chartSummary',
  CHECK_VALID_GATEWAY = '/gateway/checkValidGateway',
}

/**
 * @description: GET_SUMMARY
 */

export const getSummary = (params: any) => request.get<any>({ url: Api.GET_SUMMARY, params });

/**
 * @description: GET_API_RESUT_LIST
 */

export const getApiResultList = (params: any) => request.get<any>({ url: Api.GET_API_RESUT_LIST, params });

/**
 * @description: GET_STATUS_SUMMARY
 */

export const getStatusSummary = (params: any) => request.get<any>({ url: Api.GET_STATUS_SUMMARY, params });

/**
 * @description: GET_COST_TIME
 */

export const getCostTime = (params: any) => request.get<any>({ url: Api.GET_COST_TIME, params });

/**
 * @description: GET_API_DETAILS
 */

export const getApiDetails = (params: any) => request.get<any>({ url: Api.GET_API_DETAILS, params });

/**
 * @description: GET_CHART_SUMMARY
 */

export const getChartSummary = (params: any) => request.get<any>({ url: Api.GET_CHART_SUMMARY, params });

/**
 * @description: CHECK_VALID_GATEWAY
 */

export const checkValidGateway = (params: any) => request.get<any>({ url: Api.CHECK_VALID_GATEWAY, params });
