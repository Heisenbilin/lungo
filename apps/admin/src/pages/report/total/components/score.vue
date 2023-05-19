<template>
  <div class="flex h-20 flex-row justify-center chart-container-full">
    <a-spin size="large" class="flex self-center" v-if="loading" />
    <template v-else>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip :overlayStyle="{ maxWidth: '400px' }">
            <template #title>
              总评分数 = (性能评分+稳定性评分) / 2 。<br />
              性能与稳定性都非常重要，开发者需充分考虑性能与稳定性两方面的质量，避免出现“偏科”的情况。
            </template>
            总评分数
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium" :style="{ color: barFinColor(rankData.total_score) }">
            {{ rankData.total_score || 0 }}
          </div>
        </div>
      </div>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip :overlayStyle="{ maxWidth: '800px' }">
            <template #title>
              <div class="mb-1">评分规则：以下各项指标的加权平均值</div>
              <a-table
                :columns="PERFORMANCE_COLUMNS"
                :data-source="PERFORMANCE_INDEX"
                size="small"
                :pagination="false"
              />
            </template>
            性能得分
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div
          class="text-3xl font-medium"
          :style="{ color: barFinColor(rankData.performance_score) }"
        >
          {{ rankData.performance_score || 0 }}
        </div>
      </div>

      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip :overlayStyle="{ maxWidth: '400px' }">
            <template #title>
              <div class="mb-1">评分规则：以下各项指标得分平均值</div>
              <a-table
                :columns="STABILITY_COLUMNS"
                :data-source="STABILITY_INDEX"
                size="small"
                :pagination="false"
              />
            </template>
            稳定性得分
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="text-3xl font-medium" :style="{ color: barFinColor(rankData.stable_score) }">
          {{ rankData.stable_score || 0 }}
        </div>
      </div>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">排名</div>
        <div class="flex items-end">
          <span class="text-3xl font-medium">{{ rankData.rank }}</span>
          <span class="text-xl text-gray-500">/{{ rankData.total }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getProjectRanking } from '@/apis/report/index'
import { Empty } from 'ant-design-vue'
import { useReportStore } from '@/store/modules/report'
import { barFinColor } from '@vben/utils'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import {
  PERFORMANCE_COLUMNS,
  PERFORMANCE_INDEX,
  STABILITY_COLUMNS,
  STABILITY_INDEX,
} from '../../config'
import { scoreColumns, scoreData } from '@/pages/list/components/utils'

const reportStore = useReportStore()

const rankData = ref({ total_score: 0, performance_score: 0, stable_score: 0, rank: 0, total: 0 })

const loading = ref(false) //0为加载，1无数据，2有数据

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
    loading.value = true
    let scoreData = await getProjectRanking(params.value)
    if (scoreData.stat === 1) {
      rankData.value = scoreData.data[0] || {
        total_score: 0,
        performance_score: 0,
        stable_score: 0,
        rank: 0,
        total: 0,
      }
    } else {
      rankData.value = { total_score: 0, performance_score: 0, stable_score: 0, rank: 0, total: 0 }
    }
  } catch (e) {
    rankData.value = { total_score: 0, performance_score: 0, stable_score: 0, rank: 0, total: 0 }
    console.log('项目总评加载失败:', e)
  } finally {
    loading.value = false
  }
}
</script>
