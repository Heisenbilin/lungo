import { request } from "@vben/request";
enum Api {
  GET_ERR_TYPE_LIST = "/tool/geterrortypelist",
  ADD_ALARM_RULE = "/tool/addalarmrule",
  UPDATE_ALARM_RULE = "/tool/updatealarmrule",
  CHANGE_ALARM_RULE_STATUS = "/tool/changealarmrulestatus",
  GET_ALARM_RULE_LIST = "/tool/getalarmrulelist",
  GET_ALARM_LOG_LIST = "/tool/getalarmloglist",
  GET_ALARM_ACTION_LOG_LIST = "/tool/getalarmactionloglist",
  REMOVE_ALARM_RULE = "/tool/removealarmrule",
  IGNORE_ALARM_TYPE = "/tool/ignorealarmtype",
  ALARM_AUTH = "/tool/alarmAuth",
}

/**
 * @description: 错误类型列表
 */

export const requestErrorTypeList = () => request.get<any>({ url: Api.GET_ERR_TYPE_LIST });

/**
 * @description: 新增告警规则
 */

export const requestAddAlarmRule = (params: any) =>
  request.post<any>({ url: Api.ADD_ALARM_RULE, params });

/**
 * @description: 修改告警规则
 */

export const requestUpdateAlarmRule = (params: any) =>
  request.post<any>({ url: Api.UPDATE_ALARM_RULE, params });

/**
 * @description: 修改告警规则状态
 */

export const requestUpdateRuleStatus = (params: any) =>
  request.post<any>({ url: Api.CHANGE_ALARM_RULE_STATUS, params });

/**
 * @description: 告警规则列表
 */

export const requestAlarmRuleList = (params: any) =>
  request.get<any>({ url: Api.GET_ALARM_RULE_LIST, params });

/**
 * @description: 告警日志列表
 */

export const requestAlarmLogList = (params: any) =>
  request.get<any>({ url: Api.GET_ALARM_LOG_LIST, params });

/**
 * @description: 告警日志列表
 */

export const requestAlarmActionLogList = (params: any) =>
  request.get<any>({ url: Api.GET_ALARM_ACTION_LOG_LIST, params });

/**
 * @description: 删除告警规则
 */

export const requestRemoveAlarmRule = (params: any) =>
  request.post<any>({ url: Api.REMOVE_ALARM_RULE, params });

/**
 * @description: IGNORE_ALARM_TYPE
 */

export const requestIgnoreAlarmType = (params: any) =>
  request.post<any>({ url: Api.IGNORE_ALARM_TYPE, params });

/**
 * @description: 检查监控预警的权限
 */

export const checkAlarmAuth = (uc_group_id: any, workcode: any) =>
  request.get<any>({
    url: Api.ALARM_AUTH,
    params: {
      uc_group_id,
      workcode,
    },
  });

/**
 * @description: 移除监控预警权限
 */

export const removeAlarmAuth = (uc_group_id: any, workcode: any) =>
  request.put<any>({
    url: Api.ALARM_AUTH,
    params: {
      uc_group_id,
      workcode,
    },
  });
