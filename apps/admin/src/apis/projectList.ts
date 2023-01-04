import { request } from "@vben/request";

enum Api {
  PROJECT = "/huatuo/projects",
  GET_PROJECT_DATA = "/huatuo/projectboard",
  MODIFY_PROJECT = "/huatuo/modify/projects",
  STAR_PROJECT = "/huatuo/collectProject",
  CHECK_PROJECT = "/project/checkProjectData",
  CHECK_PROJECT_AUTH = "/huatuo/checkAuth",
  GET_GROUPS = "/huatuo/groups",
  PROXY = "/proxy",
  PROXY_GET = "/proxyGet",
}

/**
 * @description: 查询项目列表
 */

export const getProjectList = (params: any) => request.get<any>({ url: Api.PROJECT, params });

/**
 * @description: 新增项目
 */

export const addProject = (data: any) => request.post<any>({ url: Api.PROJECT, data });

/**
 * @description: 查询项目列表
 */

export const getProjectBoard = (params: any) =>
  request.get<any>({ url: Api.GET_PROJECT_DATA, params });

/**
 * @description: 修改项目
 */

export const modifyProject = (project_id: any, data: any) =>
  request.put<any>({ url: `${Api.PROJECT}/${project_id}`, data });

/**
 * @description: 修改项目部分字段
 */

export const modifyProjectParams = (project_id: any, data: any) =>
  request.put<any>({ url: `${Api.MODIFY_PROJECT}/${project_id}`, data });

/**
 * @description: 获取项目详细信息
 */

export const getProject = (project_id: any) =>
  request.get<any>({ url: `${Api.PROJECT}/${project_id}` });

/**
 * @description: 项目收藏
 */

export const starProject = (data: any) => request.post<any>({ url: Api.STAR_PROJECT, data });

/**
 * @description: 巡检项目数据
 */

export const checkProjectData = () => request.get<any>({ url: Api.CHECK_PROJECT });

/**
 * @description: 检查用户与项目的权限
 */

export const checkProjectAuth = (project_id: any) =>
  request.get<any>({ url: `${Api.CHECK_PROJECT_AUTH}/${project_id}` });

/**
 * @description: 检查用户与项目的权限
 */

export const getUserGroups = () => request.get<any>({ url: Api.GET_GROUPS });

/**
 * @description: 根据用户组ID查询用户组用户信息
 */

export const getGroupRoleUsers = (group_id: any, role: any, limit: any) =>
  request.post<any>({
    url: Api.PROXY_GET,
    data: {
      url: `//uc.xesv5.com/api/auth/groups/${group_id}/role_users`,
      data: {
        role,
        limit,
      },
    },
  });

/**
 * @description: 检查用户质量周报权限
 */

export const checkWeeklyReportAuth = (uc_group_id: any, user_account: any) =>
  request.post<any>({
    url: Api.PROXY_GET,
    data: {
      url: `//app.xesv5.com/bigfish/v1/interface/weeklyReportAuth`,
      data: {
        uc_group_id,
        user_account,
      },
    },
  });

/**
 * @description: 移除用户质量周报权限
 */

export const removeWeeklyReportAuth = (uc_group_id: any, user_account: any) =>
  request.post<any>({
    url: Api.PROXY,
    data: {
      url: `//app.xesv5.com/bigfish/v1/interface/weeklyReportAuth`,
      data: {
        uc_group_id,
        user_account,
      },
    },
  });

/**
 * @description: 获取华佗菜单服务，不走拦截
 */
//params: any
export const getMenuList = () => {
  // return axios.get('/api/v1/user/tree', { params });
};
