import { request } from '@vben/request'

enum TaskType {
  GET_CUSTOM_LIST = '/v2/custom/list',
  ADD_CUSTOM = '/v2/custom/add',
  CUSTOM_CONFIG = '/v2/custom',
}

// 自定义看板相关接口

// 获得自定看板列表
export const getCustomList = (params: any) => {
  return request.get({
    url: TaskType.GET_CUSTOM_LIST,
    params,
  })
}

// 新增自定义看板
export const addCustom = (data: any) => {
  return request.post({
    url: TaskType.ADD_CUSTOM,
    data,
  })
}

export const getCustomConfig = (custom_id: any) =>
  request.get({ url: `${TaskType.CUSTOM_CONFIG}/${custom_id}` })

export const modifyCustom = (custom_id: any, data) =>
  request.put({ url: `${TaskType.CUSTOM_CONFIG}/${custom_id}`, data })

export const modifyCustomConfig = (custom_id: any, data) =>
  request.put({ url: `${TaskType.CUSTOM_CONFIG}/${custom_id}`, data })
