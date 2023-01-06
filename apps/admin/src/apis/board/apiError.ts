import { request } from "@vben/request";
enum Api {
  SUMMARY = "/interface/summary",
  COSTTIME = "/interface/costTime",
  API_RESULT_LIST = "/interface/apiResultList",
  STATUS_SUMMARY = "/interface/statusSummary",
  CHART_SUMMARY = "/interface/chartSummary",
  TOP_10 = "/interface/top10",
  API_DETAILS = "interface/apiDetails",
}

/**
 * @description: 获取接口异常汇总数据
 */

export const getSummaryData = (params: any) => request.post<any>({ url: Api.SUMMARY, params });

/**
 * @description: 获取接口耗时数据
 */

export const getCostTimeData = (params: any) => request.post<any>({ url: Api.COSTTIME, params });

/**
 * @description: 获取接口列表数据
 */

export const getResultListData = (params: any) =>
  request.post<any>({ url: Api.API_RESULT_LIST, params });

/**
 * @description: 获取状态码分布数据
 */

export const getStatusData = (params: any) =>
  request.post<any>({ url: Api.STATUS_SUMMARY, params });

/**
 * @description: 获取图表汇总数据
 */

export const getChartSummaryData = (params: any) =>
  request.post<any>({ url: Api.CHART_SUMMARY, params });

/**
 * @description: 获取top10表数据
 */

export const getTop10Data = (params: any) => request.post<any>({ url: Api.TOP_10, params });

/**
 * @description: 获取接口详情数据
 */

export const getApiDetailsData = (params: any) =>
  request.get<any>({ url: Api.API_DETAILS, params });
