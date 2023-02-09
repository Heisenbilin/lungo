import { MonitorPage } from '@vben/constants'
import { useListStore } from '@/store/modules/list'
import { useBoardStore } from '@/store/modules/board'
import { useReportStore } from '@/store/modules/report'
import { useBoardDataStore } from '@/store/modules/panel'
import { BoardInfo } from '@vben/types'

const listStore = useListStore()
const boardStore = useBoardStore()
const reportStore = useReportStore()
const boardDataStore = useBoardDataStore()

/*
 * 生成跳转链接
 */
export const useLinkToUrl = (
  projectId: number,
  to: MonitorPage,
  from: MonitorPage,
  tabKey = 'pageview',
) => {
  const query: any = { projectId }
  switch (from) {
    case 'list':
      query.start_time = listStore.startTime
      query.end_time = listStore.endTime
      query.dimension = listStore.dimension === 'week' ? 'day' : 'hour'
      break
    case 'board':
      query.start_time = boardStore.filterState.start_time
      query.end_time = boardStore.filterState.end_time
      query.dimension = boardStore.filterState.dimension
      break
    case 'panel':
      query.start_time = boardDataStore.filterState.start_time
      query.end_time = boardDataStore.filterState.end_time
      query.dimension = boardDataStore.filterState.dimension
      break
    case 'report':
      query.start_time = reportStore.filterState.start_time
      query.end_time = reportStore.filterState.end_time
      query.dimension = 'day'
      break
  }

  switch (to) {
    case 'board':
      query.tabKey = tabKey
      return { name: 'Board', query }
    case 'panel':
      return { name: 'Panel', query }
    case 'report':
      return { name: 'Report', query }
  }

  return { to: '' }
}

/*
 * 将项目信息存入store
 */
export const useStoreProject = (project: BoardInfo, to: MonitorPage) => {
  switch (to) {
    case 'board':
      boardStore.boardInfoState = project
      break
    case 'panel':
      boardDataStore.boardInfoState = project
      break
    case 'report':
      reportStore.boardInfoState = project
      break
  }
}
