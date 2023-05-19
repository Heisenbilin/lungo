<template>
  <div class="chart-container-full">
    <div class="chart-title">稳定性报告 - 运行时异常率({{ runtimeRate }})</div>
    <div :style="{ height: '360px' }">
      <div class="h-full flex-center" v-if="stabilityLoading">
        <a-spin size="large" />
      </div>
      <a-empty
        v-else-if="runtimeChartOption === null"
        class="h-full flex-center"
        :image="simpleImage"
      />
      <BasicChart v-else :chartOption="runtimeChartOption" height="360px" />
    </div>
  </div>
  <div class="chart-container-full">
    <div class="chart-title">稳定性报告 - Resource异常率({{ resourceRate }})</div>
    <div :style="{ height: '360px' }">
      <div class="h-full flex-center" v-if="stabilityLoading">
        <a-spin size="large" />
      </div>
      <a-empty
        v-else-if="resourceChartOption === null"
        class="h-full flex-center"
        :image="simpleImage"
      />
      <BasicChart v-else :chartOption="resourceChartOption" height="360px" />
    </div>
  </div>
  <div class="chart-container-full">
    <div class="chart-title">稳定性报告 - 白屏率({{ whiteRate }})</div>
    <div :style="{ height: '360px' }">
      <h3 class="error-text" v-if="noWhite">
        --无法统计(项目未接入白屏，
        <a href="http://app.xesv5.com/fanghuo" target="_blank"> 点击接入 </a>)--
      </h3>
    </div>
  </div>
  <div class="chart-container-full">
    <div class="chart-title">稳定性报告 - 优化建议</div>
    <div class="h-full flex-center" v-if="loading.auditsLoading === 0">
      <a-spin size="large" />
    </div>
    <a-empty v-else-if="loading.auditsLoading === 1" :image="simpleImage" />
    <template v-else v-for="[clumpId, auditRefs] of stabilityAudits" :key="clumpId">
      <audit-layout v-if="clumpId !== 'NotAGroup'" :audits="auditRefs" :group="groups[clumpId]" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Empty } from 'ant-design-vue'
import { BasicChart } from '@vben/components'
import { getStabilityReport } from '@/apis/report/index'
import { getStabilityAudits } from './audit/util'
import { getScore } from '../config'
import { getTop10Option } from '@/pages/board/component/util/pieChartConfig'
import { getQuery, useRouteQuery } from '@vben/router'
// import chart from './chart.vue'
import AuditLayout from './audit/auditLayout.vue'

//页面质量周报稳定性组件
type Props = {
  preparedLighthouse: any
  groups: any
  lighthouseLoading: number
}

const props = defineProps<Props>()

const startTime = useRouteQuery('start_time')
const endTime = useRouteQuery('end_time')
const projectId = useRouteQuery('project_id')
const url = useRouteQuery('url', '')

const requestParams = computed(() => ({
  start_time: startTime.value,
  end_time: endTime.value,
  project_id: projectId.value,
  board_url: decodeURIComponent(url.value),
}))

const stabilityLoading = ref<boolean>(true)

const runtimeChartData = ref<any>(null)
const runtimeChartOption = computed(() => getTop10Option(runtimeChartData.value))
const runtimeScore = ref<number>(0)
const runtimeRate = ref<string>('0%')

const resourceChartData = ref<any>(null)
const resourceChartOption = computed(() => getTop10Option(resourceChartData.value))
const resourceScore = ref<number>(0)
const resourceRate = ref<string>('0%')

const whiteRate = ref<string>('0%')
const whiteScore = ref<number>(100)
const noWhite = ref(false)

// 监听分数变化，emit分数
watch([runtimeScore, resourceScore, whiteScore], () => {
  const score = ((runtimeScore.value + resourceScore.value + whiteScore.value) / 3).toFixed(0)
  emit('stabilityScoreChange', parseFloat(score))
})

// 旧请求参数字符串，防止重复请求
let oldParamsString: string = ''

watch(
  () => requestParams,
  async val => {
    const newPramsString = JSON.stringify(val.value)
    if (newPramsString === oldParamsString) {
      stabilityLoading.value = false
      return
    }
    oldParamsString = newPramsString
    stabilityLoading.value = true
    try {
      const result = await getStabilityReport(val.value)
      if (result.stat === 1) {
        runtimeChartData.value = result.data.runtime
        let runtimeNum = parseFloat(result.data.runtimeerrorRate)
        runtimeRate.value = result.data.runtimeerrorRate
        runtimeScore.value = getScore(runtimeNum)
        resourceChartData.value = result.data.resource
        let resourceNum = parseFloat(result.data.resourceerrorRate)
        resourceRate.value = result.data.resourceerrorRate
        resourceScore.value = getScore(resourceNum)
      } else {
        runtimeChartData.value = null
        resourceChartData.value = null
      }
    } catch {
      runtimeChartData.value = null
      resourceChartData.value = null
    } finally {
      stabilityLoading.value = false
    }
  },
  { immediate: true, deep: true },
)

const loading = ref({
  runtimeLoading: 0,
  resourceLoading: 0,
  whiteLoading: 0,
  auditsLoading: 0,
})

const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE)

const stabilityAudits: any = ref([])
type Emits = { (e: 'stabilityScoreChange', score: number): void }
const emit = defineEmits<Emits>()
//监听父组件lighthouse数据加载标识，解析lighthouse数据
watch(
  () => props.lighthouseLoading,
  () => {
    if (props.lighthouseLoading === 2) {
      stabilityAudits.value = getStabilityAudits(props.preparedLighthouse)
      loading.value.auditsLoading = 2
    } else {
      loading.value.auditsLoading = props.lighthouseLoading
    }
  },
)
</script>
