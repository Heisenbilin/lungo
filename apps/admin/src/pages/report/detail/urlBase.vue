<template>
  <div class="chart-container-full">
    <a-card class="h-full" :bordered="false">
      <template #title>
        <div class="h-7">
          <span class="mr-4">页面信息</span>
          <a-select
            v-model:value="boardURL"
            placeholder="请选择页面"
            style="min-width: 500px"
            showSearch
            optionFilterProp="label"
          >
            <a-select-option v-for="item of urlList" :label="item" :value="item"> </a-select-option>
          </a-select>
        </div>
      </template>
      <div class="flex gap-3 flex-wrap">
        <div class="py-1"><InfoTag title="所属项目" :content="urlInfo.projectName" /></div>
        <div class="py-1"><InfoTag title="报告时间" :content="urlInfo.reportTime" /></div>
      </div>
    </a-card>
  </div>

  <div class="flex h-20 flex-row justify-center chart-container-full">
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
        <div class="text-3xl font-medium" :style="{ color: barFinColor(avgScore) }">
          {{ avgScore || 0 }}
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
      <div class="text-3xl font-medium" :style="{ color: barFinColor(score.performanceScore) }">
        {{ score.performanceScore }}
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
      <div class="text-3xl font-medium" :style="{ color: barFinColor(score.stabilityScore) }">
        {{ score.stabilityScore }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onActivated, watch } from 'vue'
import { addOrUpdateQuery, getQuery } from '@vben/router'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import {
  PERFORMANCE_COLUMNS,
  PERFORMANCE_INDEX,
  STABILITY_COLUMNS,
  STABILITY_INDEX,
} from '../config'
import { barFinColor } from '@vben/utils'
import InfoTag from '@/pages/component/infoCard/infoTag.vue'

import dayjs from 'dayjs'
import { getProjectBoardUrl } from '@/apis/report'

//页面质量周报总评组件
const props = defineProps({
  score: {
    type: Object,
    default: () => {
      return {
        performanceScore: 0,
        stabilityScore: 0,
      }
    },
  },
})

const urlInfo = ref({
  //基本信息
  projectName: '',
  reportTime: '',
})

const boardURL = ref('')
const urlList = ref([])

const avgScore = computed(() => {
  const avg = (props.score.stabilityScore + props.score.performanceScore) / 2
  return avg.toFixed(0)
})

onMounted(() => {
  getUrlList()
})
onActivated(() => {
  getUrlList()
})

const getUrlList = async () => {
  const { start_time, end_time, projectId: project_id, url: board_url, project_name } = getQuery()
  const decodeUrl = decodeURIComponent(board_url as string)
  const newReportTime = `${start_time}至${dayjs(end_time as string)
    .subtract(1, 'd')
    .format('YYYY-MM-DD')}`
  if (
    project_id &&
    board_url &&
    start_time &&
    end_time &&
    (boardURL.value !== decodeUrl || newReportTime !== urlInfo.value.reportTime)
  ) {
    let params = {
      project_id,
      start_time,
      end_time,
      page: 1,
      limit: 10000000,
    }
    try {
      const result = await getProjectBoardUrl(params)
      if (result.stat === 1) {
        urlList.value = result.data.projectList.map(item => item.board_url)
      } else {
        urlList.value = []
      }
    } catch (err) {
      urlList.value = []
      console.log(err)
    }
  }
  urlInfo.value = {
    projectName: decodeURIComponent(project_name as string),
    reportTime: `${start_time}至${dayjs(end_time as string)
      .subtract(1, 'd')
      .format('YYYY-MM-DD')}`,
  }
  boardURL.value = decodeURIComponent(board_url as string)
  return []
}

// 监听url变化，改变路由
watch(boardURL, () => {
  addOrUpdateQuery({
    url: encodeURIComponent(boardURL.value),
  })
})
</script>
