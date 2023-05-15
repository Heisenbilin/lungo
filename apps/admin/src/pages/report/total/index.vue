<template>
  <div class="relative mt-3 chart-container " id="project-boardReport-content" ref="areaRef">
    <projectScore />
    <projectBase />
    <projectPerformance />
    <projectStability />
    <div v-if="warnMessage.length">
      <span class="text-lg text-red-600">{{ warnMessage }}</span>
    </div>
    <urlTable v-else />
  </div>
</template>

<script setup lang="ts">
//新版质量周报详情页Index
import { ref, onMounted, provide, watch, onActivated, onDeactivated } from 'vue'
import { useReportStore } from '@/store/modules/report'
import { useWatermark } from '@vben/hooks'
import { storeToRefs } from '@vben/stores'
import { useUserStore } from '@/store/user'
import { useAppTheme } from '@vben/hooks';

import projectScore from './components/score.vue'
import projectPerformance from './components/performance.vue'
import projectStability from './components/stability/index.vue'
import projectBase from './components/base.vue'
import urlTable from './components/urlTable.vue'

const { isDark } = useAppTheme()

const reprotStore = useReportStore()
const userStore = useUserStore()
const userName = userStore.userInfo?.account || ''

const { boardInfoState } = storeToRefs(reprotStore)

const watchFunc: any[] = []
const initWatch = () => {
  // 从其他页面返回时，重新生成水印
  const watermarkWatch = watch(
    () => [boardInfoState.value.id, userName],
    () => {
      setWatermark(`${userName}-${boardInfoState.value.project_name}`)
    },
    { immediate: true },
  )
  watchFunc.push(watermarkWatch)
}

const areaRef = ref<Nullable<HTMLElement>>(null)

const { setWatermark } = useWatermark(areaRef)
watch(isDark, () => {
  setWatermark(`${userName}-${boardInfoState.value.project_name}`)
})

//当使用手机查看时的警告信息
const warnMessage = ref('')
provide('warnMessage', warnMessage)
onMounted(() => {
  initWatch()
  //判断是否为手机查看
  if (isMobile()) {
    warnMessage.value = '推荐使用电脑端查看周报汇总及详情信息'
  }
})

onActivated(initWatch)
onDeactivated(() => {
  while (watchFunc.length) watchFunc.pop()()
})
//判断ua是否为移动端
function isMobile() {
  return navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  )
}
</script>
