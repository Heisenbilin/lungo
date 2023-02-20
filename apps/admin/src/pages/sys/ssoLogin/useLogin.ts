import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getGlobalConfig } from '@vben/utils'
import { computed, onMounted } from 'vue'
import { omit } from '@vben/utils'

const { ssoAppid, dpEnv } = getGlobalConfig(import.meta.env)

export function useLogin() {
  const router = useRouter()

  const route = useRoute()
  const userStore = useUserStore()

  const ssoToken = computed<string>(() => String(route.query?.token ?? ''))

  const env = computed(() => route.query?.env) // 本地环境为 dev，其他环境 undefined

  console.log('ssoToken', ssoToken.value, env)

  function setObjToUrlParams(baseUrl: string, obj: any): string {
    let parameters = ''
    for (const key in obj) {
      parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
    }
    parameters = parameters.replace(/&$/, '')
    return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
  }

  const goSSOLoginPage = () => {
    const ssoPageUrl = `https://sso.100tal.com/portal/login/${ssoAppid}`
    // 携带 redirect 和其他参数跳转造物神
    window.location.href = setObjToUrlParams(ssoPageUrl, {
      ...route.query,
      env: dpEnv,
    })
  }

  const login = async () => {
    // 如果链接上没有造物神 token，说明是第一次登录，不是造物神的回跳
    if (!ssoToken.value) {
      goSSOLoginPage()
      return
    }
    // 链接上有 token，说明是造物神的回跳地址
    try {
      await userStore.login(ssoToken.value)
      console.log(route.query.redirect, 'redirect')
      console.log(route.query)
      console.log(route)
      const { dpEnv } = getGlobalConfig(import.meta.env)
      const params = {
        path: decodeURIComponent((route.query.redirect as string) || '/'),
        query: {
          ...omit(route.query, ['redirect', 'token']),
          env: dpEnv,
          ...formatQuery(decodeURIComponent(route.query.redirect as string)),
        },
      }
      router.push(params)
    } catch (error) {
      console.log(error)
      userStore.logout()
    }
  }

  // const logout = () => {
  //   store.commit('setToken', '');
  //   window.location.href = `https://api.service.100tal.com/sso/logout?path=https://sso.100tal.com/portal/login/${APPID}`;
  // };

  /**
   * 解析路由中的参数
   *  example: /alarm/zhiyinlouAction?redirect=https%3A%2F%2Ffedata.xesv5.com%2Fv1%2Ftool%2Fchangealarmrulestatush5%3Fid%3
   *  result: {redirect: https%3A%2F%2Ffedata.xesv5.com%2Fv1%2Ftool%2Fchangealarmrulestatush5%3Fid%3 }
   * @param href 路由
   */
  const formatQuery = href => {
    const arr = (href.split('?')[1] || '').split('&')
    const params = {}
    for (let i = 0; i < arr.length; i++) {
      const data = arr[i].split('=')
      if (data.length == 2) {
        params[data[0]] = data[1]
      }
    }
    return params
  }
  onMounted(() => {
    // 如果 url 中携带 env=dev，说明是本地开发环境，跳转 localhost
    console.log('env', env.value, dpEnv)
    if (env.value === 'dev' && dpEnv !== 'dev') {
      console.log('跳转localhost')
      // const PORT = import.meta.env.VITE_PORT
      location.href = setObjToUrlParams(`https://localhost:3000/login`, {
        ...omit(route.query, 'env'),
      })
      return
    }
    login()
  })
}
