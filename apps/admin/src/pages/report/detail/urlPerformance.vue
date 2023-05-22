<template>
  <div class="chart-container-full">
    <div class="chart-title">性能报告 - 页面加载瀑布图</div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getAverageData"
      :getOptionFunc="data => useDataToWaterfallChartOption(data ? data.list : data)"
    />
  </div>
  <div class="chart-container-full">
    <div class="chart-title">性能报告 - 性能指标耗时统计</div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getProDayPerformanceReport"
      :getOptionFunc="getProOptions"
    />
  </div>
  <div class="chart-container-full">
    <div class="chart-title">性能报告 - 优化建议</div>
    <div class="h-full flex-center" v-if="loading.auditsLoading === 0">
      <a-spin size="large" />
    </div>
    <a-empty v-else-if="loading.auditsLoading === 1" :image="simpleImage" />
    <div v-else>
      <audit-layout
        v-if="opportunityAudits.length"
        :audits="opportunityAudits"
        :group="groups['load-opportunities']"
      />
      <audit-layout
        v-if="diagnosticAudits.length"
        :audits="diagnosticAudits"
        :group="groups.diagnostics"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getProDayPerformanceReport, getAveragePerformanceReport } from '@/apis/report/index'
import { BaseChart } from '@vben/components'
import { showAsPassed, _getWastedMs } from './audit/util'
import { getProOptions } from '../config'
import { useDataToWaterfallChartOption } from '@vben/hooks'
// import { getQuery } from '@vben/router'
import { Empty } from 'ant-design-vue'
import { computed } from 'vue'
import { useRouteQuery } from '@vben/router'
import auditLayout from './audit/auditLayout.vue'

//页面质量周报性能组件
const emit = defineEmits(['performanceScoreChange'])
const props = defineProps({
  preparedLighthouse: {
    type: Object,
    default: () => {},
  },
  groups: {
    type: Object,
    default: () => {},
  },
  lighthouseLoading: {
    type: Number,
    default: 0,
  },
})
const performanceScore = ref<number>(0)
const loading = ref({
  avgLoading: 0,
  tendencyLoading: 0,
  auditsLoading: 0,
})
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE)
const opportunityAudits = ref([])
const diagnosticAudits = ref([])

const startTime = useRouteQuery('start_time')
const endTime = useRouteQuery('end_time')
const projectId = useRouteQuery('projectId')
const url = useRouteQuery('url', '')

// const { start_time, end_time, project_id, url } = getQuery()
const requestParams = computed(() => ({
  start_time: startTime.value,
  end_time: endTime.value,
  project_id: projectId.value,
  board_url: decodeURIComponent(url.value),
}))

const getAverageData = async params => {
  try {
    const result = await getAveragePerformanceReport(params)
    if (result.stat === 1) {
      performanceScore.value = +result.data.score
      emit('performanceScoreChange', +result.data.score)
      return result
    } else {
      performanceScore.value = 0
      emit('performanceScoreChange', 0)
      return null
    }
  } catch {
    performanceScore.value = 0
    emit('performanceScoreChange', 0)
    return null
  }
}

//监听父组件lighthouse数据加载标识，解析lighthouse数据
watch(
  () => props.lighthouseLoading,
  () => {
    if (props.lighthouseLoading === 2) {
      initAudits()
    } else {
      loading.value.auditsLoading = props.lighthouseLoading
    }
  },
)

async function initAudits() {
  //性能建议数据预处理
  // Opportunities
  opportunityAudits.value = props.preparedLighthouse.auditRefs
    .filter(audit => {
      return audit.group === 'load-opportunities' && !showAsPassed(audit.result)
    })
    .sort((auditA, auditB) => {
      return _getWastedMs(auditB) - _getWastedMs(auditA)
    })
  // Diagnostics
  diagnosticAudits.value = props.preparedLighthouse.auditRefs
    .filter(audit => {
      return audit.group === 'diagnostics' && !showAsPassed(audit.result)
    })
    .sort((a, b) => {
      const scoreA = a.result.scoreDisplayMode === 'informative' ? 100 : Number(a.result.score)
      const scoreB = b.result.scoreDisplayMode === 'informative' ? 100 : Number(b.result.score)
      return scoreA - scoreB
    })
  loading.value.auditsLoading = 2
}
</script>
