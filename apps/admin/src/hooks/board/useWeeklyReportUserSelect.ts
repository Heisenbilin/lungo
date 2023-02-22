import { ref } from 'vue'
export const useWeeklyReportUserSelect = () => {
  /**
   * 设置 baseURL
   */
  const baseURL = '/v1/ht'

  const userSelectVisible = ref(false)

  /**
   * 点击选择质量周报接收用户按钮
   */
  const handleShowUserSelect = () => {
    userSelectVisible.value = true
  }

  /**
   * 关闭用户选择弹窗
   */
  const handleHideUserSelect = () => {
    userSelectVisible.value = false
  }

  return {
    baseURL,
    userSelectVisible,
    handleShowUserSelect,
    handleHideUserSelect,
  }
}
