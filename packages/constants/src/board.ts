export type Page = "board" | "data" | "report";

// 客户端数字key对应的客户端类型
export const clientUserAgent = {
  7: "pc",
  8: "web",
  9: "android",
  10: "ios",
};
export const filterTitleConfig = {
  url: "页面",
  browser: "浏览器",
  device: "设备",
  region: "地域",
  network: "网络",
  client: "客户端",
  os: "操作系统",
  resource_type: "资源文件类型",
  api_status: "请求响应码",
  api_range: "请求耗时范围",
};

export const excludeFilters = ["start_time", "end_time", "dimension", "performance_range"];

// tab页作用的筛选条件
export const tabActiveFilters = {
  pageview: ["url", "browser", "device", "region", "network", "client", "os", "performance_key"],
  performance: ["url", "browser", "device", "region", "network", "client", "os", "performance_key"],
  runtime: ["url", "browser", "device", "region", "network", "client", "os"],
  resource: ["url", "browser", "device", "region", "network", "client", "os", "resource_type"],
  api: ["url", "browser", "device", "region", "network", "client", "os", "api_status", "api_range"],
  gateway: [],
};

export const tabName = {
  pageview: "页面访问",
  performance: "性能指标",
  runtime: "运行时异常",
  resource: "资源异常",
  api: "接口异常",
  gateway: "网关监控",
};
