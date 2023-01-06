import { request } from "@vben/request";

enum Api {
  GET_SUMMARY_DATA = "/resource/errSummary",
  GET_FILE_TYPE_DATA = "/resource/errTypeSummary",
  GET_LIST_DATA = "/resource/errlist",
  GET_TOP10_DATA = "/resource/top10",
  GET_F_ERROR_DATA = "/resource/faultTolerantError",
  GET_F_ERROR_LIST_DATA = "/resource/faultTolerantErrorList",
  GET_F_TIMES_DATA = "/resource/faultTolerantTimes",
  GET_ERROR_HREF_DATA = "/resource/errHref",
  CHECK_FAULT_TOLERANT = "/resource/checkResource",
  GET_ERROR_DETAILS = "/resource/errDetails",
  GET_F_ERROR_DETAILS = "/resource/faultTolerantErrorDetails",
}

/**
 * @description: 获取资源异常汇总数据
 */

export const getSummaryData = (params: any) =>
  request.post<any>({ url: Api.GET_SUMMARY_DATA, params });

/**
 * @description: 获取异常资源文件类型数据
 */

export const getFileTypeData = (params: any) =>
  request.post<any>({ url: Api.GET_FILE_TYPE_DATA, params });

/**
 * @description: 获取异常列表数据
 */

export const getListData = (params: any) => request.post<any>({ url: Api.GET_LIST_DATA, params });

/**
 * @description: 获取异常Top10数据
 */

export const getTop10Data = (params: any) => request.post<any>({ url: Api.GET_TOP10_DATA, params });

/**
 * @description: 获取容错成功地址分步数据
 */

export const getFErrorData = (params: any) =>
  request.post<any>({ url: Api.GET_F_ERROR_DATA, params });

/**
 * @description: 获取容错详情列表数据
 */

export const getFErrorListData = (params: any) =>
  request.post<any>({ url: Api.GET_F_ERROR_LIST_DATA, params });

/**
 * @description: 获取容错次数分布数据
 */

export const getFTimesData = (params: any) =>
  request.post<any>({ url: Api.GET_F_TIMES_DATA, params });

/**
 * @description: 获取错误日志资源情况数据
 */

export const getErrorHrefData = (params: any) =>
  request.post<any>({ url: Api.GET_ERROR_HREF_DATA, params });

/**
 * @description: 检查容错
 */

export const checkFaultTolerant = (params: any) =>
  request.post<any>({ url: Api.CHECK_FAULT_TOLERANT, params });

/**
 * @description: 获取错误日志详情数据
 */

export const getErrorDetails = (params: any) =>
  request.get<any>({ url: Api.GET_ERROR_DETAILS, params });

/**
 * @description: 获取容错详情数据
 */

export const getFErrorDetails = (params: any) =>
  request.get<any>({ url: Api.GET_F_ERROR_DETAILS, params });
