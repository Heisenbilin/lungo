import { useUserStore } from '@/store/user'
import { getGlobalConfig } from '@vben/utils'
import { onMounted } from 'vue'
import { getQuery, setObjToUrlParams } from '@vben/router'

const { ssoAppid, dpEnv } = getGlobalConfig(import.meta.env)

export function useLogin() {
  const query = getQuery() as any
  const { token: ssoToken = '', env, redirect = '/' } = query
  const userStore = useUserStore()

  const login = async () => {
    // 如果链接上没有造物神 token，说明是第一次登录，不是造物神的回跳
    if (!ssoToken) {
      const ssoPageUrl = `https://sso.100tal.com/portal/login/${ssoAppid}`
      window.location.href = setObjToUrlParams(ssoPageUrl, {
        ...query,
        env: dpEnv,
      })
      return
    }
    // 链接上有 token，说明是造物神的回跳地址
    try {
      await userStore.login(ssoToken)
      location.href = location.origin + redirect
    } catch (error) {
      console.log(error)
      userStore.logout()
    }
  }

  onMounted(() => {
    if (env === 'dev') {
      console.log('url 中携带 env=dev ,跳转localhost')
      location.href = setObjToUrlParams(`https://localhost:3000/login`, query)
      return
    }
    login()
  })
}
