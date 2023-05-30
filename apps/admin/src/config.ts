import type { StaticConfig, DynamicConfig } from '@vben/types'

// github repo url
export const GITHUB_URL = 'https://github.com/vbenjs/vben3'

// vue-vben-admin-next-doc
export const DOC_URL = 'https://vbenjs.github.io/vben3-doc/'

// site url
export const SITE_URL = 'http://vben.mufei88.com/'

const dynamicConfig: DynamicConfig = {
  __: '',
}

// ! You need to clear the browser cache after the change
const staticConfig: StaticConfig = {
  authType: 'frontend',

  // enable
  enableProgress: true,
}

export const config = { ...staticConfig, ...dynamicConfig }

export const siteSetting = { GITHUB_URL, DOC_URL, SITE_URL }

export const logSDKConfig: any = (appid: string) => {
  let baseURL = ''
  //如果appid以100开头，说明是生产环境项目，否则是测试环境项目
  if (!appid.toString().startsWith('100')) {
    baseURL = 'https://dj-test.xesimg.com/appid/'
  }
  return {
    // *****SDK推荐配置*****
    // 完整配置项及其说明请访问https://app.xesv5.com/doc/pages/fedata/fe-log-sdk/access.html查看
    baseURL, // 日志上传使用的接口
    appid: `${__VITE_SDK_APPID__}`, // 日志上传的appid
    common: { eventid: 'web-swaydat' }, // 项目的唯一标识
    disableAgif: true, // 关闭展现日志上传(a.gif)
    clickMsg: { open: false }, // 关闭交互日志上传(b.gif)
    //【***注意***】trace打开后可能会造成跨域问题, 需要服务器做traceid header的跨域支持
    // 包含xueersi、xesv5、vdyoo、xiwang等域名的API网关下, 大部分默认支持该跨域规则，故推荐打开
    trace: { open: true }, //打开traceid上传
    vue: { errorHandler: true }, // 捕获Vue抛出的错误
  }
}
