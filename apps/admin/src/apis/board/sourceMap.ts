import { request } from '@vben/request'
enum Api {
  GET_BOARD_DATA = '/v1/board/chartdata',
  GET_BOARD_DATA_BY_TYPE = '/v1/board/chartdata/getByType',
  GET_MAPPING_LIST = '/v2/sourcemap/mappinglist',
  UPLOAD_SOURCEMAP = '/v2/sourcemap/uploadSourcemapFile',
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
