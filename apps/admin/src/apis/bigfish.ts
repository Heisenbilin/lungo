import { request } from '@vben/request'

export const BigfishApiPre = 'http://app.xesv5.com/bigfish/v1'
const domain = location.hostname

enum Api {
  PROXY = '/proxy',
  PROXY_GET = '/proxyGet',
}

/**
 * @description: 获取用户信息
 */

export const getUserInfo = (token = '') =>
  request.post<any>({
    url: Api.PROXY,
    data: {
      url: `${BigfishApiPre}/get/userInfo`,
      data: { token, href: domain },
    },
  })

/**
 * @description: 获取用户项目列表
 */

export const getUserProjectList = (account: string) =>
  request.post<any>({
    url: Api.PROXY,
    data: {
      url: `${BigfishApiPre}/get/projectList`,
      data: { account, href: domain },
    },
  })

/**
 * @description: 获取项目信息
 */

export const getProjectById = (project_id: string) =>
  request.post<any>({
    url: Api.PROXY_GET,
    data: {
      url: `${BigfishApiPre}/interface/getProjectById`,
      data: { project_id },
    },
  })

/**
 * @description: 获取项目信息
 */

export const isProjectUseSourceMap = (project_id: string) =>
  request.post<any>({
    url: Api.PROXY_GET,
    data: {
      url: `${BigfishApiPre}/interface/isProjectUseSourceMap`,
      data: { project_id },
    },
  })

/**
 * @description: 获取平台信息
 */

export const getPlatformInfo = () =>
  request.post<any>({
    url: Api.PROXY_GET,
    data: {
      url: `${BigfishApiPre}/get/platformInfo`,
      data: { date: 1 },
    },
  })

/**
 * @description: 检查用户质量周报权限
 */

export const checkReportAuth = (uc_group_id: any, user_account: any) =>
  request.post<any>({
    url: Api.PROXY_GET,
    data: {
      url: `${BigfishApiPre}/interface/weeklyReportAuth`,
      data: {
        uc_group_id,
        user_account,
      },
    },
  })

/**
 * @description: 移除用户质量周报权限
 */

export const removeReportAuth = (uc_group_id: any, user_account: any) =>
  request.post<any>({
    url: Api.PROXY,
    data: {
      url: `${BigfishApiPre}/interface/weeklyReportAuth`,
      data: {
        uc_group_id,
        user_account,
      },
    },
  })

/**
 * @description: 根据用户组ID查询用户组用户信息
 */

export const getGroupRoleUsers = (group_id: any, role: any, limit: any) =>
  request.post<any>({
    url: Api.PROXY_GET,
    data: {
      url: `https://uc.xesv5.com/api/auth/groups/${group_id}/role_users`,
      data: {
        role,
        limit,
      },
    },
  })
