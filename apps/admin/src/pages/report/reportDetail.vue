<template>
  <div class="weekly-main" id="weekly-main-container" ref="areaRef">
    <div class="title">质量周报</div>

    <url-base :score="score" />
    <a-divider style="background-color: #555" />

    <url-performance
      @performanceScoreChange="performanceScoreChange"
      :lighthouseLoading="lighthouseLoading"
      :preparedLighthouse="lighthouseLoading === 2 ? lighthouseData.categories.performance : {}"
      :groups="lighthouseLoading === 2 ? lighthouseData.categoryGroups : {}"
    />
    <a-divider style="background-color: #555" />

    <url-stability
      @stabilityScoreChange="stabilityScoreChange"
      :lighthouseLoading="lighthouseLoading"
      :preparedLighthouse="lighthouseLoading === 2 ? lighthouseData.categories.accessibility : {}"
      :groups="lighthouseLoading === 2 ? lighthouseData.categoryGroups : {}"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, onActivated, onDeactivated } from 'vue'
import { useRoute } from 'vue-router'
import { prepareReportResult } from './detail/util'
import { getLighthouseAudits } from '@/apis/report/apis'
import { useReportStore } from '@/store/modules/report'
import { useUserStore } from '@/store/user'
import { useWatermark } from '@vben/hooks'

import urlBase from './detail/urlBase.vue'
import urlPerformance from './detail/urlPerformance.vue'
import urlStability from './detail/urlStability.vue'

const props = defineProps({
  type: String,
})

const route = useRoute()
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

onActivated(initWatch)
onDeactivated(() => {
  while (watchFunc.length) watchFunc.pop()()
})
const score = ref({
  performanceScore: 0,
  stabilityScore: 0,
})
const lighthouseLoading = ref(0)
const lighthouseData = <any>ref([])

onMounted(() => {
  initAudits()
  initWatch()
})

function performanceScoreChange(newScore) {
  score.value.performanceScore = newScore
}

function stabilityScoreChange(newScore) {
  score.value.stabilityScore = newScore
}

async function initAudits() {
  const { start_time, project_id, url: board_url } = route.query
  const lighthouseParams = {
    project_url: decodeURIComponent(board_url as string),
    start_time: start_time + ' 00:00:00',
    project_id,
  }
  //获取lighthouse建议数据
  const lighthouse = await getLighthouseAudits(lighthouseParams)

  if (lighthouse.stat === 1 && lighthouse.data) {
    //lighthouse数据预处理
    lighthouseData.value = prepareReportResult(lighthouse.data)

    lighthouseLoading.value = 2
  } else {
    lighthouseLoading.value = 1
  }
}
</script>

<style scoped lang="scss">
.weekly-main {
  box-sizing: content-box;
  width: 800px;
  height: auto;
  background-color: #ffffff;
  margin: auto;
  padding: 47px 90px;
}
.title {
  color: #000000;
  font-size: 30px;
  line-height: 24px;
  margin: 20px;
  text-align: center;
}
</style>
