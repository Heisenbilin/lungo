import { request } from '@vben/request'
enum Api {
  GET_BOARD_DATA = '/v1/board/chartdata',
  GET_BOARD_DATA_BY_TYPE = '/v1/board/chartdata/getByType',
  GET_TIME_SOLT_DATA_BY_TYPE = '/v1/board/chartdata/getTimeSlotDataByType',
  GET_ERR_SUMMARY = '/v1/sourcemap/errSummary',
  GET_ERR_TYPE_SUMMARY = '/v1/sourcemap/errTypeSummary',
  GET_RUNTIME_LIST = '/v1/sourcemap/runtimeList',
  GET_ERR_LIST = '/v1/sourcemap/runtimeDetails',
  GET_SMFINDER_INFO = '/v1/sourcemap/smfinder',
  GET_MAPPING_LIST = '/v1/sourcemap/mappinglist',
  UPLOAD_SOURCEMAP = '/v1/sourcemap/uploadSourcemapFile',
  GET_CONFIG_INFO = 'http://app.xesv5.com/bigfish/v1/interface/isProjectUseSourceMap',
}

/**
 * @description: 获取自定义看板图表数据
 */

export const getChartData = (params: any) => request.post<any>({ url: Api.GET_BOARD_DATA, params })

/**
 * @description: 获取自定义看板图表数据
 */

export const getChartDataByType = (params: any) =>
  request.post<any>({ url: Api.GET_BOARD_DATA_BY_TYPE, params })

/**
 * @description: 获取自定义看板图表数据
 */

export const getTimeSlotDataByType = (params: any) =>
  request.post<any>({ url: Api.GET_TIME_SOLT_DATA_BY_TYPE, params })

/**
 * @description: 获取错误异常信息汇总
 */

export const getErrSummary = (params: any) => request.get<any>({ url: Api.GET_ERR_SUMMARY, params })

/**
 * @description: 获取各类异常信息汇总
 */

export const getErrTypeSummary = (params: any) =>
  request.get<any>({ url: Api.GET_ERR_TYPE_SUMMARY, params })

/**
 * @description: 获取运行时异常汇总
 */

export const getRuntimeList = (params: any) =>
  request.get<any>({ url: Api.GET_RUNTIME_LIST, params })

/**
 * @description: 获取错误列表信息
 */

export const getErrList = (params: any) => request.get<any>({ url: Api.GET_ERR_LIST, params })

/**
 * @description: 获取sourceMap解析
 */

export const getSmfinderInfo = (params: any) =>
  request.get<any>({ url: Api.GET_SMFINDER_INFO, params })

/**
 * @description: 获取sourceMap解析
 */

export const getMappingList = (params: any) =>
  request.get<any>({ url: Api.GET_MAPPING_LIST, params })

/**
 * @description: 上传sourceMap
 */

export const uploadSourcemap = (project_id: string, file: any) => {
  const fd = new FormData()
  fd.append('file', file)
  return request.post<any>({
    url: Api.UPLOAD_SOURCEMAP,
    params: {
      project_id,
    },
    data: fd,
  })
}

/**
 * @description: 获取配置信息
 */

export const getConfigInfo = (params: any) => request.get<any>({ url: Api.GET_CONFIG_INFO, params })
