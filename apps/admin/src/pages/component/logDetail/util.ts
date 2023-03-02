/*
 * 日志信息配置文件
 * @author:xiongbilin
 * 配置项：
 * name：日志项名称
 * value：日志项内容
 * span：日志项占位，2代表占一行，1代表占半行，默认为2
 * copyable：是否显示可复制图标
 * jsonParse：是否解析成格式化的json
 * isHref：是否携带链接
 * title：链接提示框文字
 * href：链接地址
 */

import { getApiDetailsData } from '@/apis/board/apiError'
import { getApiDetails as getGatewayApiDetails } from '@/apis/board/gateway'
import { getRuntimeErrorDetails } from '@/apis/board/runtime'
import { getErrorDetails, getFErrorDetails } from '@/apis/board/resource'
import { getLogDetails } from '@/apis/board/performance'
import { commafy, getGlobalConfig } from '@vben/utils'
import { clientUserAgent } from '@vben/constants'

// 环境判断
const { dpEnv } = getGlobalConfig(import.meta.env)
const isTest = dpEnv === 'dev' || dpEnv === 'test'
export const kibanaHref = isTest ? 'https://basiclog-test.xev5.com' : 'http://basiclog.xesv5.com'

// 根据type获取不同的表格配置
export const getTableColumns = type => {
  switch (type) {
    case 'performance':
      return performanceTableColumns
    case 'runtime':
      return runtimeTableColumns
    case 'resource':
      return resourceTableColumns
    case 'faultTolerant':
      return faultTolerantTableColumns
    case 'api':
      return apiTableColumns
    case 'gateway':
      return gatewayTableColumns
  }
}

// 根据type与请求params获取不同的日志数据
export const getDataList = (type, params, page = 1, pageSize = 10, ua_flag = '') => {
  switch (type) {
    case 'performance':
      return getPerformanceDetails(params, page, pageSize, ua_flag)
    case 'runtime':
      return getRuntimeDetails(params, page, pageSize, ua_flag)
    case 'resource':
      return getResourceDetails(params, page, pageSize, ua_flag)
    case 'faultTolerant':
      return getFaultTolerantDetails(params, page, pageSize)
    case 'api':
      return getApiDetails(params, page, pageSize, ua_flag)
    case 'gateway':
      return getGatewayDetails(params, page, pageSize, ua_flag)
  }
}

// 请求页面性能日志
const getPerformanceDetails = async (params, page, pageSize, ua_flag) => {
  const data = await getLogDetails({
    ...params,
    limit: pageSize,
    page: page,
    // ua_flag,
  })
  const uaList = ua_flag.length ? ua_flag.split(',') : []
  return clearPerformanceData(data, uaList)
}

// 请求运行时异常日志
const getRuntimeDetails = async (params, page, pageSize, ua_flag) => {
  const data = await getRuntimeErrorDetails({
    ...params,
    limit: pageSize,
    page: page,
    ua_flag,
  })
  const uaList = ua_flag.length ? ua_flag.split(',') : []
  return clearRuntimeData(data, uaList)
}

// 请求资源异常日志
const getResourceDetails = async (params, page, pageSize, ua_flag) => {
  const data = await getErrorDetails({
    ...params,
    limit: pageSize,
    page: page,
    ua_flag,
  })
  const uaList = ua_flag.length ? ua_flag.split(',') : []
  return clearResourceData(data, uaList)
}

// 请求资源容错日志
const getFaultTolerantDetails = async (params, page, pageSize) => {
  const data = await getFErrorDetails({
    ...params,
    limit: pageSize,
    page: page,
  })
  return clearFaultTolerantData(data)
}

// 请求接口异常日志
const getApiDetails = async (params, page, pageSize, ua_flag) => {
  const data = await getApiDetailsData({
    ...params,
    limit: pageSize,
    page: page,
    ua_flag,
  })
  const uaList = ua_flag.length ? ua_flag.split(',') : []
  return clearApiData(data, uaList)
}

// 请求接口异常日志
const getGatewayDetails = async (params, page, pageSize, ua_flag) => {
  const data = await getGatewayApiDetails({
    ...params,
    limit: pageSize,
    page: page,
    ua_flag,
  })
  const uaList = ua_flag.length ? ua_flag.split(',') : []
  return clearGatewayData(data, uaList)
}

// 页面性能表格配置
const performanceTableColumns = [
  {
    title: '生成时间',
    key: 'upload_time',
    width: '20%',
    dataIndex: 'upload_time',
  },
  {
    title: '页面URL',
    key: 'url',
    width: '70%',
    dataIndex: 'currenthref',
  },
]

// 运行时异常表格配置
const runtimeTableColumns = [
  {
    title: '生成时间',
    key: 'upload_time',
    width: '20%',
    dataIndex: 'upload_time',
  },
  {
    title: '异常内容',
    key: 'url',
    width: '70%',
    dataIndex: 'error_content',
  },
]

// 资源异常表格配置
const resourceTableColumns = [
  {
    title: '生成时间',
    key: 'upload_time',
    width: '20%',
    dataIndex: 'upload_time',
  },
  {
    title: '异常内容',
    key: 'url',
    width: '70%',
    dataIndex: 'err_content',
  },
]

// 资源容错表格配置
const faultTolerantTableColumns = [
  {
    title: '生成时间',
    key: 'upload_time',
    width: '20%',
    dataIndex: 'upload_time',
  },
  {
    title: '异常资源',
    key: 'url',
    width: '70%',
    dataIndex: 'failsource',
  },
]

//接口异常表格配置
const apiTableColumns = [
  {
    title: '生成时间',
    key: 'upload_time',
    width: '20%',
    dataIndex: 'upload_time',
  },
  {
    title: 'API URL',
    key: 'url',
    width: '70%',
    dataIndex: 'resource_url',
  },
]

// 网关监控表格配置
const gatewayTableColumns = [
  {
    title: '生成时间',
    key: 'upload_time',
    width: '20%',
    dataIndex: 'upload_time',
  },
  {
    title: 'URL',
    key: 'url',
    width: '70%',
    dataIndex: 'url',
  },
]

const clearPerformanceData = (data, uaList) => {
  let result = [{}] // runtime异常日志数组，每一个元素代表一条日志
  let total = 0
  if (data.stat === 1 && data.data?.list?.length) {
    // 日志数据清洗成符合antd Descrpition组件配置的格式
    result = data.data.list.map(item => ({
      // 跳转kibana方法
      // jumpKibana: (topicId) => {
      //   // try {
      //   //   const msg = decodeURIComponent(item.error_content.replace(/%/g, '%25'));
      //   //   return `${kibanaHref}/app/kibana#/discover?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'${topicId}',key:data.msg,negate:!f,params:(query:'${msg}',type:phrase),type:phrase,value:'${msg}'),query:(match:(data.msg:(query:'${msg}',type:phrase))))),refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))&time:(from:now%2Fd,mode:quick,to:now%2Fd))&_a=(columns:!(data.msg),index:'${topicId}',interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))`;
      //   // } catch {
      //   //   return;
      //   // }
      // },
      abstract: [
        { name: '生成时间', value: item.upload_time },
        {
          name: '页面URL',
          value: item.currenthref,
          isHref: true,
          title: '点击跳转至该页面',
          href: item.currenthref,
        },
        { name: '访问来源', value: item.referrer },
      ],
      performance: {
        dns: item.dns,
        tcp: item.tcp,
        pagessl: item.pagessl,
        ttfb: item.ttfb,
        firstbyte: item.firstbyte,
        trans: item.trans,
        dom: item.dom,
        ready: item.ready,
        res: item.res,
        // fcp: item.fcp,
        pageload: item.pageload,
        // rd: item.rd,
        // tti: item.tti,
      },
      // 用户信息
      userInfo: getUserInfo(item, uaList, 'performance'),
      upload_time: item.upload_time,
      currenthref: item.currenthref,
    }))
    total = data.data.total
  }
  return { result, total }
}

// 将“运行时异常返回值”清洗成日志组件可解析的配置列表
const clearRuntimeData = (data, uaList) => {
  let result = [{}] // runtime异常日志数组，每一个元素代表一条日志
  let total = 0
  if (data.stat === 1 && data.data?.list?.length) {
    // 日志数据清洗成符合antd Descrpition组件配置的格式
    result = data.data.list.map(item => ({
      // 跳转kibana方法
      jumpKibana: topicId => {
        try {
          const msg = decodeURIComponent(item.error_content.replace(/%/g, '%25'))
          return `${kibanaHref}/app/kibana#/discover?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'${topicId}',key:data.msg,negate:!f,params:(query:'${msg}',type:phrase),type:phrase,value:'${msg}'),query:(match:(data.msg:(query:'${msg}',type:phrase))))),refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))&time:(from:now%2Fd,mode:quick,to:now%2Fd))&_a=(columns:!(data.msg),index:'${topicId}',interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))`
        } catch {
          return
        }
      },
      abstract: [
        { name: '生成时间', value: item.upload_time },
        { name: '异常内容', value: item.error_content, copyable: true },
        {
          name: '页面URL',
          value: item.error_currenthref,
          isHref: true,
          title: '点击跳转至该页面',
          href: item.error_currenthref,
        },
        {
          name: '异常文件URL',
          value: item.error_url,
          isHref: true,
          title: '点击跳转至该文件',
          href: item.error_url,
        },
      ],
      // 用户信息
      userInfo: getUserInfo(item, uaList),
      stackList: JSON.parse(item.error_stack || '{}'),
      tryToGetSourceMapList: true,
      upload_time: item.upload_time,
      error_content: item.error_content,
    }))
    total = data.data.total
  }
  return { result, total }
}

// 将“资源异常返回值”清洗成日志组件可解析的配置列表
const clearResourceData = (data, uaList) => {
  let result = [{}] // resource异常日志数组，每一个元素代表一条日志
  let total = 0
  if (data.stat === 1 && data.list?.length) {
    // 日志数据清洗成符合antd Descrpition组件配置的格式
    result = data.list.map(item => ({
      // 跳转kibana方法
      jumpKibana: topicId => {
        try {
          const msg = decodeURIComponent(item.resource_url.replace(/%/g, '%25'))
          return `${kibanaHref}/app/kibana#/discover?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'${topicId}',key:data.url,negate:!f,params:(query:'${msg}',type:phrase),type:phrase,value:'${msg}'),query:(match:(data.url:(query:'${msg}',type:phrase))))),refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))&time:(from:now%2Fd,mode:quick,to:now%2Fd))&_a=(columns:!(data.url),index:'${topicId}',interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))`
        } catch {
          return
        }
      },
      abstract: [
        { name: '生成时间', value: item.upload_time },
        { name: '异常内容', value: item.resource_url, copyable: true },
        {
          name: '页面URL',
          value: item.resource_currenthref,
          isHref: true,
          title: '点击跳转至该页面',
          href: item.resource_currenthref,
        },
        {
          name: '容错列表',
          value: item.error_list.split(','),
          arrayParse: true,
          copyable: item.error_list.length !== 0,
        },
        {
          name: '容错次数',
          value: item.fault_tolerant_count,
          span: 1,
        },
        { name: 'tagName', value: item.resource_tagName, span: 1 },
        { name: 'xPath', value: item.resource_xPath },
        { name: 'outerHTML', value: item.resource_outerHTML },
        { name: 'selector', value: item.resource_selector },
      ],
      //用户信息
      userInfo: getUserInfo(item, uaList),
      upload_time: item.upload_time,
      err_content: item.resource_url,
    }))
    total = data.total
  }
  return { result, total }
}

//将“资源容错返回值”清洗成日志组件可解析的配置列表
const clearFaultTolerantData = data => {
  let result = [{}] //资源日志数组，每一个元素代表一条日志
  let total = 0
  if (data.stat === 1 && data?.list?.length) {
    //日志数据清洗成符合antd Descrpition组件配置的格式
    result = data.list.map(item => ({
      //跳转kibana方法
      // jumpKibana: (topicId) => {
      //   const msg = item.resource_url
      //     .replace(/'+/g, "!'")
      //     .replace(/=+/g, '%3D!')
      //     .replace(/\s+/g, '%20');
      //   return `${kibanaHref}/app/kibana#/discover?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'${topicId}',key:data.url,negate:!f,params:(query:'${msg}',type:phrase),type:phrase,value:'${msg}'),query:(match:(data.url:(query:'${msg}',type:phrase))))),refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&time:(from:now%2Fd,mode:quick,to:now%2Fd))&_a=(columns:!(data.url),index:'${topicId}',interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))`;
      // },
      abstract: [
        { name: '生成时间', value: item.upload_time },
        {
          name: '页面URL',
          value: item.resource_currenthref,
          isHref: true,
          title: '点击跳转至该页面',
          href: item.resource_currenthref,
        },
        { name: '异常资源', value: item.failsource, copyable: true },
        { name: '容错成功资源', value: item.successsource, copyable: true },
        { name: 'pvid', value: item.pvid },
        { name: 'loglevel', value: item.loglevel },
        { name: '资源路径', value: item.resource_path },
        { name: '容错次数', value: item.fault_tolerant_count },
        {
          name: '容错列表',
          value: item.error_list.split(','),
          arrayParse: true,
          copyable: item.error_list.length !== 0,
        },
      ],
      upload_time: item.upload_time,
      failsource: item.failsource,
    }))
    total = data.total
  }
  return { result, total }
}

// 将“接口异常返回值”清洗成日志组件可解析的配置列表
const clearApiData = (data, uaList) => {
  let result = [{}] //api异常日志数组，每一个元素代表一条日志
  let total = 0
  if (data.stat === 1 && data.data?.list?.length) {
    //日志数据清洗成符合antd Descrpition组件配置的格式
    result = data.data.list.map(item => ({
      //跳转kibana方法
      jumpKibana: topicId => {
        try {
          const msg = encodeURIComponent(item.resource_url.replace(/%/g, '%25'))
          return `${kibanaHref}/app/kibana#/discover?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'${topicId}',key:data.resourceUrl,negate:!f,params:(query:'${msg}',type:phrase),type:phrase,value:'${msg}'),query:(match:(data.resourceUrl:(query:'${msg}',type:phrase))))),refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))&time:(from:now%2Fd,mode:quick,to:now%2Fd))&_a=(columns:!(data.resourceUrl),index:'${topicId}',interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))`
        } catch {
          return
        }
      },
      abstract: [
        { name: '生成时间', value: item.upload_time },
        { name: '请求URL', value: item.resource_url, copyable: true },
        {
          name: '请求页面',
          value: item.currenthref,
          isHref: true,
          title: '点击跳转至该页面',
          href: item.currenthref,
        },
        { name: '请求方法', value: item.method, span: 1 },
        { name: '请求耗时', value: commafy(item.elapsed_time) + ' ms', span: 1 },
        { name: '响应码', value: item.status, span: 1 },
        {
          name: 'traceid',
          value: item.traceid,
          span: 1,
          isHref: true,
          copyable: true,
          title:
            '点击查看traceid链路详情\n注：采用sso登录方式跳转日志中心查看详情。（不通过sso登录可能会造成重复登录/无法重定向的问题）',
          href: getTraceidURL(item.traceid),
        },
        { name: '访问来源', value: item.referrer },
        // { name: '接口返回', ...parseJson(item.response) },
      ],
      //用户信息
      userInfo: getUserInfo(item, uaList),
      upload_time: item.upload_time,
      resource_url: item.resource_url,
    }))
    total = data.data.total
  }
  return { result, total }
}

// 将“网关异常返回值”清洗成日志组件可解析的配置列表
const clearGatewayData = (data, uaList) => {
  let result = [{}] // gateway异常日志数组，每一个元素代表一条日志
  let total = 0
  if (data.stat === 1 && data.data?.list?.length) {
    // 日志数据清洗成符合antd Descrpition组件配置的格式
    result = data.data.list.map(item => ({
      // 跳转kibana方法
      // jumpKibana: topicId => {
      //   try {
      //     const msg = encodeURIComponent(item.resource_url.replace(/%/g, '%25'));
      //     return `${kibanaHref}/app/kibana#/discover?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'${topicId}',key:data.resourceUrl,negate:!f,params:(query:'${msg}',type:phrase),type:phrase,value:'${msg}'),query:(match:(data.resourceUrl:(query:'${msg}',type:phrase))))),refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))&time:(from:now%2Fd,mode:quick,to:now%2Fd))&_a=(columns:!(data.resourceUrl),index:'${topicId}',interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))`;
      //   } catch {
      //     return;
      //   }
      // },
      abstract: [
        { name: '生成时间', value: item.upload_time },
        { name: 'URL', value: item.url, copyable: true },
        { name: '请求', value: item.request },
        { name: 'upstream address', value: item.upstream_address },
        { name: 'upstream 响应时间', value: commafy(item.upstream_response_time) + ' ms', span: 1 },
        { name: 'upstream 响应码', value: item.upstream_status, span: 1 },
        { name: 'http_x_forwarded_for', value: item.http_x_forwarded_for, span: 1 },
        { name: 'remote address', value: item.remote_address, span: 1 },
        { name: 'remote port', value: item.remote_port, span: 1 },
        { name: 'http_referrer', value: item.http_referrer, span: 1 },
        { name: '请求方式', value: item.request_method, span: 1 },
        { name: '请求耗时', value: commafy(item.request_time) + ' ms', span: 1 },
        { name: 'request_trace_id', value: item.request_trace_id, span: 1 },
        { name: '域名', value: item.domain, span: 1 },
        { name: 'scheme', value: item.scheme, span: 1 },
        { name: 'server_name', value: item.server_name, span: 1 },
        { name: 'request_body', value: item.request_body },
        { name: 'http_cookie', value: item.http_cookie },
        {
          name: 'traceid',
          value: item.traceid,
          span: 1,
          isHref: true,
          copyable: true,
          title:
            '点击查看traceid链路详情\n注：采用sso登录方式跳转日志中心查看详情。（不通过sso登录可能会造成重复登录/无法重定向的问题）',
          href: getTraceidURL(item.traceid),
        },
        { name: '响应码', value: item.status, span: 1 },
        // { name: '接口返回', ...parseJson(item.response) },
      ],
      //用户信息
      userInfo: getUserInfo(item, uaList),
      upload_time: item.upload_time,
      url: item.url,
    }))
    total = data.data.total
  }
  return { result, total }
}

//将能JSON解析的字符串解析，否则返回原字符串
// const parseJson = (str) => {
//   try {
//     return { value: JSON.parse(str), jsonParse: true };
//   } catch {
//     return { value: str };
//   }
// };

//解析用户信息配置
const getUserInfo = (item, uaList, type = 'normal') => {
  const userInfo = [
    {
      name: 'UA',
      value: item.ua,
    },
    {
      name: 'IP地址',
      value: item.cip || (item.visit_ip ? JSON.parse(item.visit_ip).cip : ''),
      span: 1,
    },
    {
      name: 'ID',
      value: item.cid || (item.visit_ip ? JSON.parse(item.visit_ip).cid : ''),
      span: 1,
    },
    {
      name: '浏览器',
      value: connectValue(item.uaDetails.browser.name, item.uaDetails.browser.version),
      span: 1,
    },
    {
      name: '内核',
      value: connectValue(item.uaDetails.engine.name, item.uaDetails.engine.version),
      span: 1,
    },
    {
      name: '操作系统',
      value: connectValue(item.uaDetails.os.name, item.uaDetails.os.version),
      span: 1,
    },
    {
      name: 'CPU',
      value: item.uaDetails.cpu.architecture,
      span: 1,
    },
    {
      name: '设备',
      value: connectValue(item.uaDetails.device.vendor, item.uaDetails.device.model),
      span: 1,
    },
    // { name: 'CPU', value: item.visit_ip && JSON.parse(item.visit_ip).cname, span: 1 },
  ]
  if (type === 'performance') {
    userInfo.push({ name: '客户端', value: clientUserAgent[item.clientid] })
    userInfo.push({ name: '设备类型', value: item.effective_type, span: 1 })
    userInfo.push({ name: '网速', value: item.downlink ? item.downlink + ' mb/s' : '', span: 1 })
  }
  for (const ua of uaList) {
    userInfo.push({ name: ua, value: item.uaDetails[ua], span: 1 })
  }
  return userInfo
}

const connectValue = (str1, str2) => {
  if (!str1) {
    return ''
  }
  if (!str2) {
    return str1
  }
  return str1 + ' ' + str2
}

const getTraceidURL = traceid => {
  return `https://sso.100tal.com/portal/login/2069294699?target=https%3A%2F%2Fcloud.tal.com%2Flogcenter%252F%23%2Ftrace%3FtraceId%3Dc6c8193c-a501-4a68-83ab-75d8c854cf9c-29&login_url=https%3A%2F%2Fcloud.tal.com%2Fthreepartylogin&project=logcenter%252F%23%2Ftrace%3FtraceId%3D${traceid}`
}
