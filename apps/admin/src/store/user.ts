// import type { LoginParams } from '@/apis/auth'
// import { BASIC_HOME_PATH, BASIC_LOGIN_PATH, PageEnum } from '@vben/constants'
// import { router } from '@/router'
import { getUserInfoApi, doLoginApi } from '@/apis/auth' //doLogoutApi,
// import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes'
// import { useAuthStoreWithout } from './auth'
// import { GetUserInfoModel } from '@/apis/sys/user'
import { UserInfo, UserState } from '@vben/types' // , ErrorMessageMode
import { defineStore } from 'pinia'
import { getGlobalConfig, setToken } from '@vben/utils'

export const useUserStore = defineStore({
  id: 'app-user-store',
  persist: {
    paths: ['userInfo', 'accessToken'],
  },
  state: (): UserState => ({
    userInfo: null,
    accessToken: undefined,
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {},
  actions: {
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
    },
    resetState() {
      this.userInfo = null
      this.accessToken = undefined
      this.sessionTimeout = false
    },

    async login(token: string) {
      const { ssoHost } = getGlobalConfig(import.meta.env)
      const { data } = await doLoginApi({ token, host: ssoHost })
      this.accessToken = data.token
      setToken(data.token)
      this.setUserInfo({
        account: data.account,
        name: data.name,
        role: data.role,
        workcode: data.workcode,
      })
    },
    async getUserInfoAction() {
      const { data } = await getUserInfoApi()
      this.setUserInfo({
        account: data.account,
        name: data.name,
        role: data.role,
        workcode: data.workcode,
      })
      console.log('this.userInfo', this.userInfo)
    },

    // async login(
    //   params: LoginParams & {
    //     goHome?: boolean
    //     mode?: ErrorMessageMode
    //   },
    // ): Promise<UserInfo | null> {
    //   try {
    //     const { goHome = true, mode, ...loginParams } = params
    //     let { accessToken } = await doLoginApi(loginParams, mode)
    //     accessToken =
    //       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoieGlvbmdiaWxpbiIsIm5hbWUiOiLnhornoqfmnpciLCJyb2xlIjoyLCJ3b3JrY29kZSI6IjMxMzMzOSIsImlhdCI6MTY3MjgwMjkzOCwiZXhwIjoxNjcyODg5MzM4fQ.f3TPBMLRo9ARrd_a3mGLQZCmRQFHWi0BZMyIkrK6J-Y'

    //     if (!this.accessToken) {
    //       return null
    //     }
    //     const userInfo = await this.getUserInfoAction()
    //     if (goHome) {
    //       await router.replace(BASIC_HOME_PATH)
    //     }
    //     return userInfo
    //   } catch (error) {
    //     return Promise.reject(error)
    //   }
    // },
    // async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
    //   if (!this.accessToken) {
    //     return null
    //   }
    //   // get user info
    //   const userInfo = await this.getUserInfoAction()

    //   const sessionTimeout = this.sessionTimeout
    //   if (sessionTimeout) {
    //     this.sessionTimeout = false
    //   } else {
    //     const permissionStore = useAuthStoreWithout()
    //     if (!permissionStore.isDynamicAddedRoute) {
    //       const routes = await permissionStore.buildRoutesAction()
    //       routes.forEach(route => {
    //         router.addRoute(route)
    //       })
    //       router.addRoute(PAGE_NOT_FOUND_ROUTE)
    //       permissionStore.setDynamicAddedRoute(true)
    //     }
    //     goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME))
    //   }
    //   return userInfo
    // },

    // async getUserInfoAction(): Promise<UserInfo | null> {
    //   if (!this.accessToken) {
    //     return null
    //   }

    //   const userInfo = (await getUserInfoApi()) as unknown as UserInfo
    //   this.setUserInfo(userInfo)

    //   return userInfo
    // },

    async logout(goLogin = false) {
      // goLogin = false
      const { dpEnv, ssoAppid } = getGlobalConfig(import.meta.env)
      function setObjToUrlParams(baseUrl: string, obj: any): string {
        let parameters = ''
        for (const key in obj) {
          parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
        }
        parameters = parameters.replace(/&$/, '')
        return /\?$/.test(baseUrl)
          ? baseUrl + parameters
          : baseUrl.replace(/\/?$/, '?') + parameters
      }

      this.accessToken = undefined
      this.sessionTimeout = false
      this.setUserInfo(null)
      setToken('')
      const { hash } = window.location
      const path = setObjToUrlParams(`https://sso.100tal.com/portal/login/${ssoAppid}`, {
        env: dpEnv,
        redirect: hash.slice(1), // hash => #/projectboard/qcEntry1631/:week  hash.slice(1) => /projectboard/qcEntry1631/:week
      })
      window.location.href = `https://api.service.100tal.com/sso/logout?path=${encodeURIComponent(
        path,
      )}`
      // if (goLogin) {
      //   router.push(BASIC_LOGIN_PATH)
      // }
    },
  },
  // @ts-ignore
  // persist: {
  //   strategies: [{ paths: ['userInfo', 'accessToken'] }],
  // },
})

// Need to be used outside the setup
export function useUserStoreWithout() {
  return useUserStore()
}
