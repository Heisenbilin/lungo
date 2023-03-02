import { request } from '@vben/request'

enum Api {
  SEARCH_WORKER_INFO = '/v1/tool/searchworkerinfo',
  GET_YACH_ID = '/v1/tool/getyachid',
}

/**
 * @description: 查询人员基本信息
 */

export const searchWorkerInfo = (data: any) =>
  request.post<any>({ url: Api.SEARCH_WORKER_INFO, data })

/**
 * @description: 查询知音楼ID
 */

export const requestYachId = (data: any) => request.post<any>({ url: Api.GET_YACH_ID, data })
