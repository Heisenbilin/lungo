import { addOrUpdateUrlParams, delUrlParams} from '@vben/utils';
import { logTypeEnum } from '@vben/constants';
import { message } from 'ant-design-vue';
import type { BoardInfo, filter, logInfo, BoardState } from '@vben/types';
import { defineStore } from 'pinia';

const noNeedMessageKeys = ['start_time', 'end_time', 'dimension'];

const allFilterKeys = [
  'start_time',
  'end_time',
  'dimension',
  'url',
  'string',
  'browser',
  'device',
  'region',
  'network',
  'client',
  'os',
  'performance_key',
  'performance_range',
  'resource_type',
  'api_status',
  'api_range',
];

export const useReportStore = defineStore({
  id: 'app-report',
  state: (): BoardState => ({
    // 项目信息
    boardInfoState: { appid: '', eventid: '', id: -1, project_name: '' },
    // 加载标志
    loadingState: false,
    // 筛选条件
    filterState: { start_time: '', end_time: '', dimension: 'day' },
    // 日志详情
    logInfoState: { type: logTypeEnum.DEFAULT, visible: false, requestParams: {} },
    // 项目topicId
    topicIdState: '',
    // 最新sdk版本号
    latestSDKVersionState: '',
    // tab页
    // tabState: 'pageview',
  }),
  getters: {
    getBoardInfoState(): BoardInfo {
      return this.boardInfoState;
    },
    getLoadingState(): boolean {
      return this.loadingState;
    },
    getFilterState(): filter {
      return this.filterState;
    },
    getLogInfoState(): logInfo {
      return this.logInfoState;
    },
    getTopicIdState(): string {
      return this.topicIdState;
    },
    getLatestSDKVersionState(): string {
      return this.latestSDKVersionState;
    },
    // getTabState(): string | undefined {
    //   return this.tabState;
    // },
    // 根据时间范围与展示维度计算合适的日期格式化规则
    // getTimeFormatStr(): string {
    //   const { start_time, end_time, dimension } = this.filterState;
    //   return computeTimeFormatStr(start_time, end_time, dimension);
    // },
    logRequestParams(): object {
      return {
        project_id: this.boardInfoState.id,
        start_time: this.filterState.start_time,
        end_time: this.filterState.end_time,
        ...this.logInfoState.requestParams,
      };
    },
  },
  actions: {
    commitBoardInfoState(info: BoardInfo): void {
      this.boardInfoState = info;
    },
    commitLoadingState(loading: boolean): void {
      this.loadingState = loading;
    },
    commitFilterState(filter: filter): void {
      this.filterState = filter;
      addOrUpdateUrlParams(this.filterState);
      // 删除路由中不需要的参数
      const delKeys: string[] = [];
      allFilterKeys.map((key) => !Object.keys(filter).includes(key) && delKeys.push(key));
      delUrlParams(delKeys);
    },
    commitLogInfoState(logInfo: logInfo): void {
      this.logInfoState = logInfo;
    },
    // commitTabState(tabkey: string): void {
    //   this.tabState = tabkey;
    //   addOrUpdateUrlParams({ tabkey });
    // },
    openLogInfoState(logInfo: logInfo): void {
      // 只有进入的新状态为true打开状态、且state中为false关闭状态才生效
      if (!logInfo.visible || this.logInfoState.visible) return;
      this.logInfoState = logInfo;
      addOrUpdateUrlParams({
        log_type: logInfo.type,
        log_params: JSON.stringify(logInfo.requestParams),
      });
    },
    closeLogInfoState(): void {
      // 只有state中为true打开状态才生效
      if (!this.logInfoState.visible) return;
      delUrlParams(['log_type', 'log_params']);
      this.logInfoState = {
        type: logTypeEnum.DEFAULT,
        visible: false,
        requestParams: {},
      };
    },
    commitTopicIdState(topicId: string): void {
      this.topicIdState = topicId;
    },

    commitLatestSDKVersionState(latestSDKVersion: string): void {
      this.latestSDKVersionState = latestSDKVersion;
    },

    addFilterValue(values: object): void {
      const oldFilter = JSON.stringify(this.filterState);
      Object.assign(this.filterState, values);
      const newFilter = JSON.stringify(this.filterState);
      if (oldFilter !== newFilter) {
        addOrUpdateUrlParams(this.filterState);
        if (Object.keys(values).some((key) => !noNeedMessageKeys.includes(key))) {
          message.success(`已更新筛选条件`);
        }
      }
    },

    delFilterValue(name: string): void {
      if (Object.keys(this.filterState).includes(name)) {
        delete this.filterState[name];
        delUrlParams(name);
        // addOrUpdateUrlParams(this.filterState);
        if (!noNeedMessageKeys.includes(name)) {
          message.warning(`已删除筛选条件`);
        }
      }
    },

    initStateValue(info: BoardInfo): void {
      // if (!info?.noInitFilter) {
      this.filterState = { start_time: '', end_time: '' };
      // }
      this.boardInfoState = info;
      this.logInfoState = { type: logTypeEnum.DEFAULT, visible: false, requestParams: {} };
    },
  },
});