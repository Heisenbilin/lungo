import { defineStore } from 'pinia'

export const useTest = defineStore({
  id: 'use--test',
  state: () => ({
    test: '人孔盖福利卡',
  }),
  persist: true,
})
