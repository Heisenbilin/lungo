import { Page } from '@vben/constants'
import { useListStore } from '@/store/modules/list'
import { useBoardStore } from '@/store/modules/board'
import { useReportStore } from '@/store/modules/report'
import { useBoardDataStore } from '@/store/modules/panel'
import { BoardInfo } from '@vben/types'

const listStore = useListStore()
const boardStore = useBoardStore()
const reportStore = useReportStore()
const boardDataStore = useBoardDataStore()

const { platform } = listStore

/*
 * 生成跳转链接
 */
export const useLinkToUrl = (projectId: string | number, page: Page) => {
  if (platform === '') {
    switch (page) {
      case 'board':
        return `/monitor/board?projectId=${projectId}`
      case 'data':
        return `/monitor/data?projectId=${projectId}`
      case 'report':
        return `/monitor/report?projectId=${projectId}&dimen=week`
    }
  } else if (platform === 'huatuo') {
    switch (page) {
      case 'board':
        return `/huatuo/board/${projectId}`
      case 'data':
        return `/huatuo/data/${projectId}`
      case 'report':
        return `/huatuo/report/${projectId}`
    }
  }
  return ''
}

/*
 * 将项目信息存入store
 */
export const useStoreProject = (project: BoardInfo, page: Page) => {
  switch (page) {
    case 'board':
      boardStore.filterState.start_time = listStore.startTime
      boardStore.filterState.end_time = listStore.endTime
      boardStore.filterState.dimension = listStore.dimension === 'week' ? 'day' : 'hour'
      boardStore.boardInfoState = project
      break
    case 'data':
      boardDataStore.boardInfoState = project
      break
    case 'report':
      reportStore.boardInfoState = project
      break
  }
}
