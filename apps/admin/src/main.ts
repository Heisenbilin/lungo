import '@vben/styles'
// import 'ant-design-vue/dist/antd.variable.css'
import 'virtual:svg-icons-register'
import App from './app.vue'
import { createApp } from 'vue'
import { InitRouter } from '@vben/router'
import { setupRouteGuard } from '@/router/guard'
import { setupI18n } from '@vben/locale'
import { setupPinia } from '@vben/stores'
import { initApplication } from './init-application'
import { registerComponents } from '../init-components'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import XesLoggerSDK from '@xes/xes_fe_log'

const SDKConfig = {
  // *****SDK推荐配置*****
  // 完整配置项及其说明请访问https://app.xesv5.com/doc/pages/fedata/fe-log-sdk/access.html查看
  baseURL: '', // 日志上传使用的接口
  appid: `${__VITE_SDK_APPID__}`, // 日志上传的appid
  common: { eventid: 'web-swaydat' }, // 项目的唯一标识
  disableAgif: true, // 关闭展现日志上传(a.gif)
  clickMsg: { open: false }, // 关闭交互日志上传(b.gif)
  //【***注意***】trace打开后可能会造成跨域问题, 需要服务器做traceid header的跨域支持
  // 包含xueersi、xesv5、vdyoo、xiwang等域名的API网关下, 大部分默认支持该跨域规则，故推荐打开
  trace: { open: true }, //打开traceid上传
  vue: { errorHandler: true }, // 捕获Vue抛出的错误
}

;(async () => {
  const app = createApp(App)
  // if(!dpEnv)
  app.use(XesLoggerSDK, SDKConfig)
  // app.use(pinia)

  setupPinia(app)

  await registerComponents(app)

  await initApplication()
  // Register Global Components

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app)
  // Init Router
  const router = InitRouter(import.meta.env.VITE_PUBLIC_PATH)
  app.use(router)
  app.use(Antd)
  await setupRouteGuard()
  await router.isReady()
  app.mount('#app')
  // When Closing mock, Tree Shaking `mockjs` dep
  if (__VITE_USE_MOCK__) {
    import('../mock/_mock-server').then(({ setupProdMockServer }) => setupProdMockServer())
  }
})()
