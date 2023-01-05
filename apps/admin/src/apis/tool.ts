import { request } from '@vben/request'

enum Api {
  SEARCH_WORKER_INFO = '/tool/searchworkerinfo',
}

/**
 * @description: 查询人员基本信息
 */

export const searchWorkerInfo = (data: any) => request.post<any>({ url: Api.SEARCH_WORKER_INFO, data });