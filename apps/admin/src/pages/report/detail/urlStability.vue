<template>
  <div class="stability">
    <a-row>
      <a-col :span="16">
        <div class="first-title">二、稳定性</div>
        <div id="stability-description" class="content-text">
          <a-spin size="large" class="loading" v-if="loading.auditsLoading === 0" />
          <span v-else-if="loading.auditsLoading === 1">
            稳定性评分主要考量Runtime 异常率、Resource 异常率以及白屏率三个指标分数<br />
            三个指标进行加权计算所得的分数作为稳定性评分，分数越高稳定性也越好<br />
            稳定性不足的位置会着重报告，需要开发人员进行进一步优化
          </span>
          <link-text v-else :text="preparedLighthouse.description" />
        </div>
      </a-col>
      <a-col :span="8">
        <circle-progress
          ref="$circle"
          class="progress"
          key="duration-model"
          :progress="stabilityScore"
        />
      </a-col>
    </a-row>

    <div class="runtime-container">
      <div class="second-title">2.1 Runtime异常率({{ runtimeRate }})</div>
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
      <div>
        <span class="rule"> 计算规则：Runtime / PV </span> <span class="rule">权重：33%</span>
        <div class="rule">
          分值计算：
          <span class="top">0~1% 75~100分</span>
          <span class="mid">1~3% 50~75分</span>
          <span class="bot">3%以上 0~50分</span>
        </div>
      </div>
    </div>

    <div class="resource-container">
      <div class="second-title">2.2 Resource异常率({{ resourceRate }})</div>
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
      <div>
        <span class="rule">计算规则：Resource / PV</span><span class="rule">权重：34%</span>
        <div class="rule">
          分值计算：<span class="top">0~1% 75~100分</span><span class="mid">1~3% 50~75分</span
          ><span class="bot">3%以上 0~50分</span>
        </div>
      </div>
    </div>

    <div class="resource-container">
      <div class="second-title">2.3 白屏率-服务端({{ whiteRate }})</div>
      <h3 class="error-text" v-if="noWhite">
        --无法统计(项目未接入白屏，
        <a href="http://app.xesv5.com/fanghuo" target="_blank"> 点击接入 </a>)--
      </h3>
      <div>
        <span class="rule">计算规则：白屏次数 / 检测次数</span><span class="rule">权重：33%</span>
        <div class="rule">
          分值计算：<span class="top">0~1% 75~100分</span>
          <span class="mid">1~3% 50~75分</span>
          <span class="bot">3%以上 0~50分</span>
        </div>
      </div>
    </div>

    <div class="second-title">2.4 稳定性优化建议</div>
    <a-spin size="large" class="loading" v-if="loading.auditsLoading === 0" />
    <a-empty v-else-if="loading.auditsLoading === 1" :image="simpleImage" />
    <template v-else v-for="[clumpId, auditRefs] of stabilityAudits" :key="clumpId">
      <audit-layout v-if="clumpId !== 'NotAGroup'" :audits="auditRefs" :group="groups[clumpId]" />
    </template>
    <a-divider style="background-color: #555" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Empty } from 'ant-design-vue'
import { BasicChart } from '@vben/components'
import { getErrSummary } from '@/apis/report/apis'
import { getStabilityReport } from '@/apis/report/index'
import { getStabilityAudits } from './util'
import { getScore, getUrlErrorOptions } from './config'
import { getTop10Option } from '@/pages/board/component/util/pieChartConfig'
import { getQuery } from '@vben/router'
import CircleProgress from '@vben/components/src/chart/circleProgress.vue'
// import chart from './chart.vue'
import linkText from './linkText.vue'
import AuditLayout from './audit/auditLayout.vue'

//页面质量周报稳定性组件
type Props = {
  preparedLighthouse: any
  groups: any
  lighthouseLoading: number
}

const props = defineProps<Props>()

const { start_time, end_time, project_id, url } = getQuery()

const requestParams = computed(() => ({
  start_time,
  end_time,
  project_id,
  board_url: decodeURIComponent(url),
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
const whiteScore = ref<number>(0)
const noWhite = ref(false)

const stabilityScore = computed(() => {
  const score = ((runtimeScore.value + resourceScore.value + whiteScore.value) / 3).toFixed(0)
  emit('stabilityScoreChange', parseFloat(score))
  return score
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
