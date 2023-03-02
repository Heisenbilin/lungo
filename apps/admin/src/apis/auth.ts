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
    url: '/v1/login',
    params,
  })
}

export function getUserInfoApi() {
  console.log('getUserInfoApi')
  return request.get<any>({ url: '/v1/account' })
}

export function getPermCode() {
  return request.get<string[]>({ url: '/v1/basic-api/getPermCode' })
}

export function doLogoutApi() {
  return request.get({ url: '/v1/logout' })
}

export const checkLightHouseAuth = (data: any) => {
  return request.post<any>({ url: '/v1/checkAuth', data })
}
