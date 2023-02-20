import { defineStore } from 'pinia'
import { getUserGroups } from '@/apis/list'

interface ListState {
  startTime: string
  endTime: string
  dimension: 'week' | 'day'
  ucGroups: any[]
  ucGroupVisible: boolean
  forceFlashFlag: {
    all: boolean
    star: boolean
  }
}

export const useListStore = defineStore({
  id: 'app-list',
  state: (): ListState => ({
    startTime: '',
    endTime: '',
    dimension: 'week',
    ucGroups: [],
    ucGroupVisible: false,
    forceFlashFlag: {
      //应用列表强制刷新标志
      all: false,
      star: false,
    },
  }),
  getters: {},
  actions: {
    //获取有权限的用户组
    async requestUCGroups() {
      const res = <any>await getUserGroups()
      if (res.stat === 1) {
        this.ucGroups = res.data
      }
    },
  },
})
