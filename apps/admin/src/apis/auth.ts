import type { ErrorMessageMode } from '@vben/types'
import { request } from '@vben/request'

export interface RoleInfo {
  name: string
  value: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResultModel {
  userId: string | number
  accessToken: string
  role: RoleInfo
}

export interface UserInfoModel {
  roles: RoleInfo[]
  userId: string | number
  username: string
  realName?: string
  avatar: string
  desc?: string
}

export function doLoginApi(
  params: LoginParams,
  mode: ErrorMessageMode = 'modal',
) {
  return request.post<LoginResultModel>(
    {
      url: '/basic-api/login',
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

export function getUserInfoApi() {
  return request.get<UserInfoModel>(
    { url: '/basic-api/getUserInfo' },
    { errorMessageMode: 'none' },
  )
}

export function getPermCode() {
  return request.get<string[]>({ url: '/basic-api/getPermCode' })
}

export function doLogoutApi() {
  return request.get({ url: '/basic-api/logout' })
}

export const checkLightHouseAuth = ( data: any ) => {
  return request.post<any>({ url: '/v1/checkAuth', data })
}
