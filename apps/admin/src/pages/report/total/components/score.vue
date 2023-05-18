<template>
  <div class="report-title">一、项目总评</div>
  <div class="min-h-60 flex-center">
    <a-spin size="large" v-if="loading === 'loading'" />
    <a-empty v-else-if="loading === 'empty'" :image="simpleImage" />
    <div v-else class="w-full flex-center gap-4 flex-wrap">
      <div class="w-full sm:w-1/3 lg:w-1/5 xl:1/6">
        <circle-progress ref="$circle" key="duration-model" :progress="total_score" />
        <div class="text-center font-medium text-lg">项目质量</div>
      </div>
      <div class="w-full sm:w-1/3 lg:w-1/5 xl:1/6">
        <circle-progress ref="$circle" key="duration-model" :progress="performance_score" />
        <div class="text-center font-medium text-lg">页面性能</div>
      </div>
      <div class="w-full sm:w-1/3 lg:w-1/5 xl:1/6">
        <circle-progress ref="$circle" key="duration-model" :progress="stability_score" />
        <div class="text-center font-medium text-lg">服务稳定</div>
      </div>
      <div class="w-full sm:w-1/3 lg:w-1/5 xl:1/6">
        <div class="flex-center h-[145px]">
          <div>
            <span class="text-6xl">{{ rank }}</span>
            <span class="text-xl text-gray-500">/{{ total }}</span>
          </div>
        </div>
        <div class="text-center font-medium text-lg">综合排名</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getProjectRanking } from '@/apis/report/index'
import { Empty } from 'ant-design-vue'
import { useReportStore } from '@/store/modules/report'
import CircleProgress from '@vben/components/src/chart/circleProgress.vue'

const reportStore = useReportStore()

const total_score = ref(0)
const performance_score = ref(0)
const stability_score = ref(0)
const rank = ref(0)
const total = ref(0)
const loading = ref('loading') //0为加载，1无数据，2有数据
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE)

const params = computed(() => ({
  project_id: `${reportStore.boardInfoState.id}`,
  start_time: reportStore.filterState.start_time,
  end_time: reportStore.filterState.end_time,
}))

watch(params, initData, { immediate: true })

//后台数据获取与处理
async function initData() {
  try {
    //项目评分 数据获取预处理
    loading.value = 'loading'
    let scoreData = await getProjectRanking(params.value)
    if (scoreData.msg === 'success') {
      loading.value = 'loaded'
      total_score.value = scoreData.data ? scoreData.data.total_score : 0
      performance_score.value = scoreData.data ? scoreData.data.performance_score : 0
      stability_score.value = scoreData.data ? scoreData.data.stable_score : 0
      rank.value = scoreData.data ? scoreData.data.rank : 0
      total.value = scoreData.data ? scoreData.data.total : 0
    } else {
      loading.value = 'empty'
    }
  } catch (e) {
    console.log('项目总评加载失败:', e)
  }
}
</script>
