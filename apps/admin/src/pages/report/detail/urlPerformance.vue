<template>
  <div class="performance">
    <a-row>
      <a-col :span="16">
        <div class="first-title">一、性能</div>
        <div class="content-text">
          性能分数是加权平均的指标分数。<br />
          权重越高的指标对您的整体的效果得分的影响越大。<br />
          度量标准分数在报告中不可见，但在后台进行计算。
        </div>
      </a-col>
      <a-col :span="8">
        <circle-progress
          ref="$circle"
          class="progress"
          key="duration-model"
          :progress="performanceScore"
        />
      </a-col>
    </a-row>
    <div class="avg-container">
      <a-spin size="large" class="loading" v-if="loading.avgLoading === 0" />
      <a-empty v-else-if="loading.avgLoading === 1" class="empty" :image="simpleImage" />
      <chart v-else chartName="avg-main" class="avg-main" :option="averagePerformanceOption" />
    </div>

    <div class="score-rule">
      <div class="second-title">1.2 性能指标介绍</div>
      <div v-for="item in indexList" :key="item.name" class="rule-item">
        <div>
          <span class="name-performance">指标：</span>
          <span class="text-performance">{{ item.name }}</span>
        </div>
        <div>
          <span class="name-performance">计算规则：</span>
          <span class="text-performance">{{ item.rule }}</span>
        </div>
        <div>
          <span class="name-performance">权重：</span>
          <span class="text-performance">{{ item.weight }}</span>
        </div>
        <div>
          <span class="name-performance">分值计算：</span>
          <span class="text-performance">
            <table style="display: inline">
              <tr v-for="score in item.score" :key="score.score">
                <td style="padding-right: 20px">{{ score.time }}</td>
                <td>{{ score.score }}</td>
              </tr>
            </table>
          </span>
        </div>
      </div>
    </div>

    <div class="avg-container">
      <a-spin size="large" class="loading" v-if="loading.tendencyLoading === 0" />
      <a-empty v-else-if="loading.tendencyLoading === 1" :image="simpleImage" />
      <chart v-else chartName="tendency-main" class="avg-main" :option="proDayPerformanceOption" />
    </div>
    <div>
      <div class="second-title">1.4 性能优化建议</div>
      <a-spin size="large" class="loading" v-if="loading.auditsLoading === 0" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getProDayPerformance, getAveragePerformance } from '@/apis/report/apis'
import { showAsPassed, _getWastedMs } from './util'
import { INDEX_LIST, getAvgOptions, getProOptions } from './config'
import { getQuery } from '@vben/router'
import { Empty } from 'ant-design-vue'
import CircleProgress from '@vben/components/src/chart/circleProgress.vue'
import auditLayout from './audit/auditLayout.vue'
import chart from './chart.vue'

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
const performanceScore: any = ref(0)
const averagePerformanceOption = ref({})
const proDayPerformanceOption = ref({})
const indexList = ref(INDEX_LIST)
const loading = ref({
  avgLoading: 0,
  tendencyLoading: 0,
  auditsLoading: 0,
})
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE)
const opportunityAudits = ref([])
const diagnosticAudits = ref([])

onMounted(() => {
  initData()
})

//监听父组件lighthouse数据加载标识，解析lighthouse数据
watch(
  () => props.lighthouseLoading,
  () => {
    if (props.lighthouseLoading === 2) {
      // console.log(props.preparedLighthouse)
      initAudits()
    } else {
      loading.value.auditsLoading = props.lighthouseLoading
    }
  },
)

async function initData() {
  const { start_time, end_time, project_id, url: board_url } = getQuery()
  const params = {
    start_time,
    end_time,
    project_id,
    board_url: decodeURIComponent(board_url as string),
    board_type: 'tti,fcp,fp,dns,tcp,ttfb',
  }

  //获取性能平均值数据
  const avgData = await getAveragePerformance(params)
  if (avgData.data) {
    averagePerformanceOption.value = getAvgOptions(avgData.data.list)
    performanceScore.value = avgData.data.score
    emit('performanceScoreChange', parseFloat(performanceScore.value))
    loading.value.avgLoading = 2
  } else {
    loading.value.avgLoading = 1
  }

  //获取日趋性能数据
  const proDayData = await getProDayPerformance(params)
  if (proDayData.data) {
    proDayPerformanceOption.value = getProOptions(proDayData.data)
    loading.value.tendencyLoading = 2
  } else {
    loading.value.tendencyLoading = 1
  }
}

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

<style scoped lang="scss">
@import './weekly.scss';
</style>
