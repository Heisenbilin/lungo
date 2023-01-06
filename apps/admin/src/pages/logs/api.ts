import instance from '/@/utils/fetch';
import { BigfishApiPre } from '/@/api/littleSquirrel';

export enum Action {
  CREATE,
  UPDATE,
  DELETE,
}

export type LogQuery = {
  /**
   * 用户邮箱前缀
   */
  user_account?: string;
  /**
   * 操作类型
   */
  action?: Action;
  /**
   * 项目名称
   */
  project_name?: string;
  /**
   * 字段
   */
  data_field?: string;
  /**
   * 开始时间
   */
  start_time?: string;
  /**
   * 结束时间
   */
  end_time?: string;
  /**
   * 页码
   */
  page: number;
  /**
   * 每页条数
   */
  page_size: number;
};

/**
 * 获取操作日志列表
 * @param params 查询参数
 */
export const getLogs = async (params: LogQuery) => {
  return instance.post(`/proxyGet`, {
    url: `${BigfishApiPre}/operationLogs`,
    data: {
      ...params,
    },
  });
};
