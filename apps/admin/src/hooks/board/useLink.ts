import { MonitorPage } from '@vben/constants'
import { useListStore } from '@/store/modules/list'
import { useBoardStore } from '@/store/modules/board'
import { useReportStore } from '@/store/modules/report'
import { useBoardDataStore } from '@/store/modules/panel'
import { BoardInfo, filter } from '@vben/types'

const listStore = useListStore()
const boardStore = useBoardStore()
const reportStore = useReportStore()
const boardDataStore = useBoardDataStore()

const { platform } = listStore

/*
 * 生成跳转链接
 */
export const useLinkToUrl = (projectId: string | number, page: MonitorPage) => {
  if (platform === '') {
    switch (page) {
      case 'board':
        return `/monitor/board`
      case 'panel':
        return `/monitor/panel`
      case 'report':
        return `/monitor/report`
    }
  } else if (platform === 'huatuo') {
    switch (page) {
      case 'board':
        return `/huatuo/board`
      case 'panel':
        return `/huatuo/panel}`
      case 'report':
        return `/huatuo/report`
    }
  }
  return ''
}

/*
 * 将项目信息存入store
 */
export const useStoreProject = (
  project: BoardInfo,
  page: MonitorPage,
  from: MonitorPage,
  tabKey = 'pageview',
) => {
  // 根据来源页，获取对应的filterState
  const filters: filter = {
    start_time: '',
    end_time: '',
  }
  switch (from) {
    case 'list':
      filters.start_time = listStore.startTime
      filters.end_time = listStore.endTime
      filters.dimension = listStore.dimension === 'week' ? 'day' : 'hour'
      break
    case 'board':
      filters.start_time = boardStore.filterState.start_time
      filters.end_time = boardStore.filterState.end_time
      filters.dimension = boardStore.filterState.dimension
      break
    case 'panel':
      filters.start_time = boardDataStore.filterState.start_time
      filters.end_time = boardDataStore.filterState.end_time
      filters.dimension = boardDataStore.filterState.dimension
      break
    case 'report':
      filters.start_time = reportStore.filterState.start_time
      filters.end_time = reportStore.filterState.end_time
      filters.dimension = 'day'
      break
  }

  switch (page) {
    case 'board':
      boardStore.tabState = tabKey
      Object.assign(boardStore.filterState, filters)
      boardStore.boardInfoState = project
      break
    case 'panel':
      Object.assign(boardStore.filterState, filters)
      boardDataStore.boardInfoState = project
      break
    case 'report':
      reportStore.boardInfoState = project
      break
  }
}
