import { request } from "@vben/request";
import ApiConfig from './config';
export const BigfishApiPre = ApiConfig.bigfish.host + ApiConfig.bigfish.version;

// TODO：直接通过配置生成接口
// TODO : whether use proxyTable ? cover all tripartite interface?
// TODO : use proxyTable, but how to config proxyTable?

// '/proxy',
const proxyBigfish = {
  getUserInfo(token = '') {
    return request.post({
      url: BigfishApiPre + '/get/userInfo',
      data: {
        token,
        href: ApiConfig.littleSquirrel.href,
      },
    });
  },
  getUserProjectList(account) {
    return request.post({
      url: BigfishApiPre + '/get/projectList',
      data: {
        account,
        href: ApiConfig.littleSquirrel.href,
      },
    });
  },
  // '/proxyGet', 
  getProjectById(project_id) {
    return request.post({
      url: BigfishApiPre + '/interface/getProjectById',
      data: {
        project_id,
      },
    });
  },
  isProjectUseSourceMap(project_id) {
    return request.post({
      url: BigfishApiPre + '/interface/isProjectUseSourceMap',
      data: {
        project_id,
      },
    });
  },
  getPlatformInfo() {
    return request.post({
      url: BigfishApiPre + '/get/platformInfo',
      data: {
        date: 1,
      },
    });
  },
};
// -----------------littleSquirrel-----------------
const TaskPath = '/board/taskinfo';

const boardTaskInfo = {
  create(insertData) {
    return request.post({
      url: `${TaskPath}`,
      data: insertData
    });
  },
  delete(boardid) {
    return request.delete({
      url: `${TaskPath}/${boardid}`,
    });
  },
  get(userid, projectid, appid, eventid) {
    return request.get({
      url: `${TaskPath}`,
      params: {
        userid,
        projectid,
        appid,
        eventid,
      },
    });
  },
  update(updateData) {
    return request.put({
      url: `${TaskPath}`,
      data: updateData,
    });
  },
  getChartData(data) {
    return request.post({
      url: `${TaskPath}/chartdata`,
      data,
    }
    );
  },
  getUAData(data) {
    return request.post({ url: '/ua/chartdata', data });
  },
  getBoardData(data) {
    return request.post({ url: '/board/chartdata/getByType', data });
  },
  getTimeSlotDataByType(data) {
    return request.post({ url: 'board/chartdata/getTimeSlotDataByType', data });
  },
  searchEsDataByQuery({ logindex, query, gte, lte }) {
    return request.post({
      url: '/board/chartdata/get_es_info_by_query', data: {
        logindex,
        query,
        gte,
        lte,
      }
    });
  },
};
enum TaskType {
  TOOL_SENDRULENOTICE='/tool/sendrulenotice',
  REPORT_GETPROJECTBOARDURL='/report/getProjectBoardUrl',
  REPORT_GETPRODAYPERFORMANCE='/report/getProDayPerformance',
  REPORT_GETPROJECTRANKING='/report/getProjectRanking',
  REPORT_GETERRORTOTALSUMMARY='/report/getErrorTotalSummary',
  REPORT_GETTWOWEEKSSUMMARY='/report/getTwoWeeksSummary',
  REPORT_GETERRORSUMMARY='/report/getErrorSummary',
  REPORT_ERR_SUMMARY= "report/errSummary",
  LIGHTHOUSE_GET_REPORT = '/lighthouse/getReport',
  REPORT_GETAVERAGEPERFORMANCE = '/report/getAveragePerformance',
  REPORT_GET_TWO_WEEKS_AVERAGE = '/report/getTwoWeeksAverage',
  REPORT_CHECK_RESOURCE= '/report/checkResource',
  REPORT_CHECK_CDN= '/report/checkCDN',
  REPORT_GET_PROJECT_LIGHTHOUSE_STATUS = '/report/getProjectLighthouseStatus',
  REPORT_RETRY_LIGHTHOUSE = '/report/retryLighthouse',
  COMMON_GROUPS = '/common/groups',
  HUA_YAN_GROUPS = '/huayan/groups',
  ACCOUNT ='account',
}
//质量周报相关接口
export const reportApis = {
  //发送知音楼企业通知
  sendRuleNotice(data) {
    return request.post({
      url: TaskType.TOOL_SENDRULENOTICE,
      data,
    });
  },
  //获取项目质量周报页面列表
  getList(params) {
    return request.get({
      url: TaskType.REPORT_GETPROJECTBOARDURL,
      params,
    });
  },
  //获得各类性能日趋指标
  getProDayPerformance(params) {
    return request.get({
      url: TaskType.REPORT_GETPRODAYPERFORMANCE,
      params,
    });
  },
  //获得项目评分与排名
  getProjectRanking(params) {
    return request.get({
      url: TaskType.REPORT_GETPROJECTRANKING,
      params,
    });
  },
  //获得项目异常总数
  getErrorTotalSummary(params) {
    return request.get({
      url: TaskType.REPORT_GETERRORTOTALSUMMARY,
      params,
    });
  },
  //获得两周数据 runtime/resource/pv/uv
  getTwoWeeksSummary(params) {
    return request.get({
      url: TaskType.REPORT_GETTWOWEEKSSUMMARY,
      params,
    });
  },
  //获得错误页面top10周报
  getErrorSummary(params) {
    return request.get({
      url: TaskType.REPORT_GETERRORSUMMARY,
      params,
    });
  },
  //获得平均项目性能指标
  getAveragePerformance(params) {
    return request.get({
      url: TaskType.REPORT_GETAVERAGEPERFORMANCE,
      params,
    });
  },
  //获得统计异常信息汇总
  getErrSummary(params) {
    return request.get({
      url: TaskType.REPORT_ERR_SUMMARY,
      params,
    });
  },
  //获取lighthouse建议
  getLighthouseAudits(params) {
    return request.get({
      url: TaskType.LIGHTHOUSE_GET_REPORT,
      params,
    });
  },
  //获得两周平均性能指标
  getTwoWeeksAverage(params) {
    return request.get({
      url: TaskType.REPORT_GET_TWO_WEEKS_AVERAGE,
      params,
    });
  },
  //获得白屏信息
  // /proxy
  getWhiteRate(params) {
    return request.post( {
      url: 'https://app.xesv5.com/fire/v1/white/getWhiteRate',
      data: {
        ...params,
      },
    });
  },
  //是否接入容错系统
  checkResourceStatus(params) {
    return request.get({
      url: TaskType.REPORT_CHECK_RESOURCE,
      params,
    });
  },
  //是否接入cdn
  checkCDNStatus(params) {
    return request.get({
      url: TaskType.REPORT_CHECK_CDN,
      params,
    });
  },
  getProjectLighthouseStatus(params) {
    return request.get({
      url: TaskType.REPORT_GET_PROJECT_LIGHTHOUSE_STATUS,
      params,
    });
  },
  retryLighthouse(params) {
    console.log('params', params);
    return request.get({
      url: TaskType.REPORT_RETRY_LIGHTHOUSE,
      params,
    });
  },
};
export const BigfishApi = proxyBigfish;
export const litSquirrelApi = { boardTaskInfo };

/**
 * 获取用户组列表
 */
export function getAuthGroups(account) {
  return request.get({
    url: TaskType.COMMON_GROUPS,
    params: {
      account,
    }
  });
}

export function getHuatuoGroups() {
  return request.get({
    url: TaskType.HUA_YAN_GROUPS,
  });
}

export function login(token) {
  const host = location.hostname;
  return request.post({
    url: '/login',
    // fedata2 和 fedata3 时显示向后端传递 host，后端根据 host 找到对应的 appid 和 appkey 后直接可请求成功
    data: host === 'fedata2.xesv5.com' || host === 'fedata3.xesv5.com' ? { token, host } : { token },
  });
}

export function account() {
  return request.get({
    url: TaskType.ACCOUNT,
  });
}
