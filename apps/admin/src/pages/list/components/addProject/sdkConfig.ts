export const getRecommendSDKConfig = (
  appid = '',
  eventid = '',
  isSaas = false,
) => `const SDKConfig = {
  // *****SDK推荐配置*****
  // 完整配置项及其说明请访问https://app.xesv5.com/doc/pages/fedata/fe-log-sdk/access.html查看
  baseURL: '${isSaas ? 'https://dj.saasz.vdyoo.com/appid/' : ''}', // 日志上传使用的接口
  appid: '${appid}', // 日志上传的appid
  common: { eventid: '${eventid}' }, // 项目的唯一标识
  disableAgif: true, // 关闭展现日志上传(a.gif)
  clickMsg: { open: false }, // 关闭交互日志上传(b.gif)
  //【***注意***】trace打开后可能会造成跨域问题, 需要服务器做traceid header的跨域支持
  // 包含xueersi、xesv5、vdyoo、xiwang等域名的API网关下, 大部分默认支持该跨域规则，故推荐打开
  trace: { open: true }, //打开traceid上传
  vue: { errorHandler: true }, // 捕获Vue抛出的错误
}`

export const getVueRecommendSDKConfig = (
  appid = '',
  eventid = '',
  isSaas = false,
) => `import XesLoggerSDK from '@xes/xes_fe_log'
const SDKConfig = {
  // *****SDK推荐配置*****
  // 完整配置项及其说明请访问https://app.xesv5.com/doc/pages/fedata/fe-log-sdk/access.html查看
  baseURL: '${isSaas ? 'https://dj.saasz.vdyoo.com/appid/' : ''}', // 日志上传使用的接口
  appid: '${appid}', // 日志上传的appid
  common: { eventid: '${eventid}' }, // 项目的唯一标识
  disableAgif: true, // 关闭展现日志上传(a.gif)
  clickMsg: { open: false }, // 关闭交互日志上传(b.gif)
  //【***注意***】trace打开后可能会造成跨域问题, 需要服务器做traceid header的跨域支持
  // 包含xueersi、xesv5、vdyoo、xiwang等域名的API网关下, 大部分默认支持该跨域规则，故推荐打开
  trace: { open: true }, //打开traceid上传
  vue: { errorHandler: true }, // 捕获Vue抛出的错误
}
Vue.use(XesLoggerSDK, SDKConfig)  //注册，建议最先use`