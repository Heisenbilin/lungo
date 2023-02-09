import type { ErrorMessageMode } from '@vben/types'
import { request } from '@vben/request'

export interface RoleInfo {
  name: string
  value: string
}

export interface LoginParams {
  token: string
  host: string
}

export interface LoginResultModel {
  userId: string | number
  accessToken: string
  role: RoleInfo
}

export interface UserInfoModel {
  userId: string | number
  username: string
  realName?: string
  avatar: string
  desc?: string
}

export function doLoginApi(params: LoginParams) {
  return request.post<any>({
    url: '/login',
    params,
  })
}

export function getUserInfoApi() {
  console.log('getUserInfoApi')
  return request.get<any>({ url: '/account' })
}

export function getPermCode() {
  return request.get<string[]>({ url: '/basic-api/getPermCode' })
}

export function doLogoutApi() {
  return request.get({ url: '/logout' })
}

export const checkLightHouseAuth = (data: any) => {
  return request.post<any>({ url: '/checkAuth', data })
}
