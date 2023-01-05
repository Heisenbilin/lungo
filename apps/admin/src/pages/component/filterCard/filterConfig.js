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
};

export const excludeFilters = ['start_time', 'end_time', 'dimension', 'performance_range'];

// tab页作用的筛选条件
export const tabActiveFilters = {
  pageview: ['url', 'browser', 'device', 'region', 'network', 'client', 'os', 'performance_key'],
  performance: ['url', 'browser', 'device', 'region', 'network', 'client', 'os', 'performance_key'],
  runtime: ['url', 'browser', 'device', 'region', 'network', 'client', 'os'],
  resource: ['url', 'browser', 'device', 'region', 'network', 'client', 'os', 'resource_type'],
  api: ['url', 'browser', 'device', 'region', 'network', 'client', 'os', 'api_status', 'api_range'],
  gateway: [],
};

const tabName = {
  pageview: '页面访问',
  performance: '性能指标',
  runtime: '运行时异常',
  resource: '资源异常',
  api: '接口异常',
  gateway: '网关监控',
};

// 筛选条件作用的tab页
export const filtersActiveTab = (() => {
  const result = {};
  for (let tab in tabActiveFilters) {
    tabActiveFilters[tab].forEach(key => {
      if (result[key]) result[key].push(tabName[tab]);
      else result[key] = [tabName[tab]];
    });
  }
  return result;
})();
