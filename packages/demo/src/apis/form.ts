import { request } from '@vben/request'

export function getSelectData(params?) {
  return request.post(
    { url: '/basic-api/demo/form/select', params },
    { joinParamsToUrl: true },
  )
}

export function getTreeSelectData(params?) {
  return request.post(
    { url: '/basic-api/demo/form/treeSelect', params },
    { joinParamsToUrl: true },
  )
}
export function getRadioData(params?) {
  return request.post(
    { url: '/basic-api/demo/form/radio', params },
    { joinParamsToUrl: true },
  )
}
export function getCascaderData(params?) {
  return request.post(
    { url: '/basic-api/demo/form/cascader', params },
    { joinParamsToUrl: true },
  )
}
