// import type { LoginParams } from '@/apis/auth'
// import { BASIC_HOME_PATH, BASIC_LOGIN_PATH, PageEnum } from '@vben/constants'
// import { router } from '@/router'
import { getUserInfoApi, doLoginApi } from '@/apis/auth' //doLogoutApi,
// import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes'
// import { useAuthStoreWithout } from './auth'
// import { GetUserInfoModel } from '@/apis/sys/user'
import { UserInfo, UserState } from '@vben/types' // , ErrorMessageMode
import { defineStore } from '@vben/stores'
import { getGlobalConfig } from '@vben/utils'
import { router, setObjToUrlParams } from '@vben/router'

export const adminUsers = [
  'liguojing',
  'gengxiaofei',
  'tianfeng1',
  'liming20',
  'chenjian11',
  'xiongbilin',
  'botao',
  'hehongyan3',
]

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
      this.setUserInfo(null)
      this.accessToken = undefined
      this.sessionTimeout = false
    },
    isAdminUser(): boolean {
      return adminUsers.includes(this.userInfo?.account)
    },
    async login(token: string) {
      const { ssoHost } = getGlobalConfig(import.meta.env)
      const { data } = await doLoginApi({ token, host: ssoHost })
      this.accessToken = data.token
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
    },

    async logout(goLogin = false) {
      const { dpEnv, ssoAppid } = getGlobalConfig(import.meta.env)
      this.resetState()
      const path = setObjToUrlParams(`https://sso.100tal.com/portal/login/${ssoAppid}`, {
        env: dpEnv,
        redirect: router.currentRoute.value.fullPath || location.pathname + location.search,
      })
      window.location.href = `https://api.service.100tal.com/sso/logout?path=${encodeURIComponent(
        path,
      )}`
    },
  },
})

// Need to be used outside the setup
export function useUserStoreWithout() {
  return useUserStore()
}
