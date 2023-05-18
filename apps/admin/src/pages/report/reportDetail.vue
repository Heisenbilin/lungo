<template>
  <div class="p-4 mb-10 bg-color">
    <div class="grid grid-cols-2 gap-3" ref="areaRef">
      <UrlBase :score="score" />

      <url-performance
        @performanceScoreChange="performanceScoreChange"
        :lighthouseLoading="lighthouseLoading"
        :preparedLighthouse="lighthouseLoading === 2 ? lighthouseData.categories.performance : {}"
        :groups="lighthouseLoading === 2 ? lighthouseData.categoryGroups : {}"
      />

      <url-stability
        @stabilityScoreChange="stabilityScoreChange"
        :lighthouseLoading="lighthouseLoading"
        :preparedLighthouse="lighthouseLoading === 2 ? lighthouseData.categories.accessibility : {}"
        :groups="lighthouseLoading === 2 ? lighthouseData.categoryGroups : {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, onActivated, onDeactivated } from 'vue'
import { prepareReportResult } from './detail/util'
import { getLighthouseAudits } from '@/apis/report/apis'
import { useReportStore } from '@/store/modules/report'
import { useUserStore } from '@/store/user'
import { useWatermark } from '@vben/hooks'
import { getQuery } from '@vben/router'

import UrlBase from './detail/urlBase.vue'
import urlPerformance from './detail/urlPerformance.vue'
import urlStability from './detail/urlStability.vue'
import { useAppTheme } from '@vben/hooks'
const { isDark } = useAppTheme()

const props = defineProps({
  type: String,
})

const reportStore = useReportStore()
const userStore = useUserStore()
const userName = userStore.userInfo?.account || ''

const watchFunc: any[] = []
const initWatch = () => {
  // 从其他页面返回时，重新生成水印
  const watermarkWatch = watch(
    () => [reportStore.boardInfoState.project_name, userName],
    () =>
      setWatermark(
        `${userName}-${reportStore.boardInfoState.project_name}-${
          props.type ? '华佗' : 'Swat Det'
        }`,
      ),
    { immediate: true },
  )
  watchFunc.push(watermarkWatch)
}

const areaRef = ref<Nullable<HTMLElement>>(null)
const { setWatermark } = useWatermark(areaRef)
watch(isDark, () => {
  setWatermark(
    `${userName}-${reportStore.boardInfoState.project_name}-${props.type ? '华佗' : 'Swat Det'}`,
  )
})

onDeactivated(() => {
  while (watchFunc.length) watchFunc.pop()()
})
const score = ref({
  performanceScore: 0,
  stabilityScore: 0,
})
const lighthouseLoading = ref(0)
const lighthouseData = <any>ref([])
const preQuery = ref<{
  start_time: string
  project_id: string
  url: string
}>(getQuery())
onMounted(() => {
  initAudits()
  initWatch()
})

onActivated(() => {
  const clearScrollElement = (
    [].slice.call(
      document.querySelectorAll('.n-layout .n-layout-scroll-container'),
    ) as HTMLDivElement[]
  ).find(el => el.style.height === 'calc(100vh - 87px)')
  if (clearScrollElement) clearScrollElement.scrollTop = 0

  if (JSON.stringify(getQuery()) !== JSON.stringify(preQuery.value)) {
    preQuery.value = getQuery()
    initAudits()
  }

  initWatch()
})

function performanceScoreChange(newScore) {
  score.value.performanceScore = newScore
}

function stabilityScoreChange(newScore) {
  score.value.stabilityScore = newScore
}

async function initAudits() {
  const { start_time, project_id, url: board_url } = preQuery.value
  const lighthouseParams = {
    project_url: decodeURIComponent(board_url as string),
    start_time: start_time + ' 00:00:00',
    project_id,
  }
  try {
    //获取lighthouse建议数据
    const lighthouse = await getLighthouseAudits(lighthouseParams)

    if (lighthouse.stat === 1 && lighthouse.data) {
      //lighthouse数据预处理
      lighthouseData.value = prepareReportResult(lighthouse.data)

      lighthouseLoading.value = 2
    } else {
      lighthouseLoading.value = 1
    }
  } catch {
    lighthouseLoading.value = 1
  }
}
</script>
