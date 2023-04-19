import { computeTimeFormatStr } from '@vben/utils'
import { logTypeEnum, noNeedMessageKeys, allFilterKeys } from '@vben/constants'
import { message } from 'ant-design-vue'
import type { BoardInfo, filter, filterState, logInfo, BoardState } from '@vben/types'
import { defineStore } from '@vben/stores'
import { getQuery, router } from '@vben/router'
import dayjs from 'dayjs'

export const useBoardStore = defineStore({
  id: 'app-board',
  state: (): BoardState => ({
    // 项目信息
    boardInfoState: { appid: '', eventid: '', id: 0, project_name: '' },
    // 筛选条件
    filterState: { start_time: '', end_time: '', dimension: 'day' },
    // 日志详情
    logInfoState: { type: logTypeEnum.DEFAULT, visible: false, requestParams: {} },
    // 项目topicId
    topicIdState: '',
    // 预警弹窗展示状态
    alarmModalVisible: false,
    // 最新sdk版本号
    latestSDKVersionState: '',
    // tab页
    tabState: '',
  }),
  getters: {
    // 根据时间范围与展示维度计算合适的日期格式化规则
    getTimeFormatStr(): string {
      const { start_time, end_time, dimension } = this.filterState
      return computeTimeFormatStr(start_time, end_time, dimension)
    },
    logRequestParams(): object {
      return {
        project_id: this.boardInfoState.id,
        start_time: this.filterState.start_time,
        end_time: this.filterState.end_time,
        ...this.logInfoState.requestParams,
      }
    },
  },
  actions: {
    setUrlQuery(): void {
      // 根据store的内容设置url参数
      const query: any = {
        projectId: this.boardInfoState.id,
        tabKey: this.tabState,
        ...this.filterState,
      }
      if (this.logInfoState.visible) {
        query.log_type = this.logInfoState.type
        query.log_params = JSON.stringify(this.logInfoState.requestParams)
      }
      router.replace({
        path: router.currentRoute.value.path,
        query,
      })
    },
    commitBoardInfoState(info: BoardInfo): void {
      this.boardInfoState = info
      this.setUrlQuery()
    },
    commitFilterState(filter: filter): void {
      this.filterState = filter
      this.setUrlQuery()
    },
    commitTabState(tabkey: string): void {
      this.tabState = tabkey
      this.setUrlQuery()
    },
    openLogInfoState(logInfo: logInfo): void {
      // 只有进入的新状态为true打开状态、且state中为false关闭状态才生效
      if (!logInfo.visible || this.logInfoState.visible) return
      this.logInfoState = logInfo
      this.setUrlQuery()
    },
    closeLogInfoState(): void {
      // 只有state中为true打开状态才生效
      if (!this.logInfoState.visible) return
      this.logInfoState = {
        type: logTypeEnum.DEFAULT,
        visible: false,
        requestParams: {},
      }
      this.setUrlQuery()
    },
    commitTopicIdState(topicId: string): void {
      this.topicIdState = topicId
    },
    commitLatestSDKVersionState(latestSDKVersion: string): void {
      this.latestSDKVersionState = latestSDKVersion
    },
    addFilterValue(values: filterState): void {
      const oldFilter = JSON.stringify(this.filterState)
      // 判断start_time和end_time是否有变化，如果有变化，通过dayjs计算出时间差值,调整展示维度
      if (values.start_time || values.end_time) {
        // 验证时间是否合法
        if (
          (values.start_time && !dayjs(values.start_time).isValid()) ||
          (values.end_time && !dayjs(values.end_time).isValid())
        ) {
          message.error(`时间格式不正确`)
          return
        }
        Object.assign(this.filterState, values)
        const dime = this.filterState.dimension
        const diffHour = dayjs(values.end_time).diff(dayjs(values.start_time), 'hour')
        if (diffHour <= 1 && (dime === 'day' || dime === 'hour')) {
          message.warning(`选择的时间段不足1小时，自动切换展示维度为‘分钟’`)
          this.filterState.dimension = 'minute'
        } else {
          if (diffHour <= 24 && dime === 'day') {
            message.warning(`选择的时间段不足1天，自动切换展示维度为‘小时’`)
            this.filterState.dimension = 'hour'
          }
        }
      } else {
        Object.assign(this.filterState, values)
      }
      const newFilter = JSON.stringify(this.filterState)
      if (oldFilter !== newFilter) {
        this.setUrlQuery()
        if (Object.keys(values).some(key => !noNeedMessageKeys.includes(key))) {
          message.success(`已更新筛选条件`)
        }
      }
    },

    delFilterValue(name: string): void {
      if (Object.keys(this.filterState).includes(name)) {
        delete this.filterState[name]
        this.setUrlQuery()
        if (!noNeedMessageKeys.includes(name)) {
          message.warning(`已删除筛选条件`)
        }
      }
    },

    initStateValue(info: BoardInfo, isUpdateFilter: boolean): void {
      const newFilters: filter = {
        dimension: this.filterState.dimension,
        start_time: this.filterState.start_time,
        end_time: this.filterState.end_time,
      }
      if (!isUpdateFilter) {
        const urlParams = getQuery()
        Object.keys(urlParams).forEach(
          key => allFilterKeys.includes(key) && (newFilters[key] = urlParams[key]),
        )
      }
      this.commitFilterState(newFilters)
      this.commitBoardInfoState(info)
      this.logInfoState = { type: logTypeEnum.DEFAULT, visible: false, requestParams: {} }
    },
  },
})
