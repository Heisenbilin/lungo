export type MonitorPage = 'board' | 'panel' | 'report' | 'urlReport' | 'group' | 'log' | 'list'

// 客户端数字key对应的客户端类型
export const clientUserAgent = {
  7: 'pc',
  8: 'web',
  9: 'android',
  10: 'ios',
}
export const filterTitleConfig = {
  url: '页面',
  browser: '浏览器',
  device: '设备',
  region: '地域',
  network: '网络',
  client: '客户端',
  os: '操作系统',
  resource_type: '资源文件类型',
  api_status: '请求响应码',
  api_range: '请求耗时范围',
}

export const allNeedFilters = ['start_time', 'end_time', 'dimension']

export const excludeFilters = ['start_time', 'end_time', 'dimension', 'performance_range']

// tab页作用的筛选条件
export const tabActiveFilters = {
  pageview: ['url', 'browser', 'device', 'region', 'network', 'client', 'os', 'performance_key'],
  performance: ['url', 'browser', 'device', 'region', 'network', 'client', 'os', 'performance_key'],
  runtime: ['url', 'browser', 'device', 'region', 'network', 'client', 'os'],
  resource: ['url', 'browser', 'device', 'region', 'network', 'client', 'os', 'resource_type'],
  api: ['url', 'browser', 'device', 'region', 'network', 'client', 'os', 'api_status', 'api_range'],
  gateway: [],
}

export enum tabListEnum {
  PAGE_VIEW = 'pageview',
  PERFORMANCE = 'performance',
  RUNTIME = 'runtime',
  RESOURCE = 'resource',
  API = 'api',
  GATEWAY = 'gateway',
}

export type tabNameType =
  | tabListEnum.PAGE_VIEW
  | tabListEnum.PERFORMANCE
  | tabListEnum.RUNTIME
  | tabListEnum.RESOURCE
  | tabListEnum.API
  | tabListEnum.GATEWAY

export const tabNameConfig = {
  [tabListEnum.PAGE_VIEW]: '页面访问',
  [tabListEnum.PERFORMANCE]: '性能监控',
  [tabListEnum.RUNTIME]: '运行时监控',
  [tabListEnum.RESOURCE]: '资源监控',
  [tabListEnum.API]: '接口监控',
  [tabListEnum.GATEWAY]: '网关监控',
}
