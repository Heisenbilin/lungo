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
import { logSDKConfig } from './config'
import 'ant-design-vue/dist/antd.less'
import XesLoggerSDK from '@xes/xes_fe_log'
;(async () => {
  const app = createApp(App)
  if (__VITE_SDK_APPID__) {
    const SDKConfig = logSDKConfig(__VITE_SDK_APPID__)
    app.use(XesLoggerSDK, SDKConfig)
  }
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
  // app.use(Antd)
  await setupRouteGuard()
  await router.isReady()
  app.mount('#app')
  // When Closing mock, Tree Shaking `mockjs` dep
  if (__VITE_USE_MOCK__) {
    import('../mock/_mock-server').then(({ setupProdMockServer }) => setupProdMockServer())
  }
})()
