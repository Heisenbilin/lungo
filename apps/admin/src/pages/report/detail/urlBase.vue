<template>
  <div class="chart-container-full">
    <a-card class="h-full" :bordered="false">
      <template #title>
        <div class="h-7">
          <span class="mr-4">项目信息</span>
          <!-- <a-select
            v-model:value=""
            placeholder="请选择页面"
            style="width: 360px"
            showSearch
            optionFilterProp="label"
          >
            <a-select-option
              v-for="item of []"
              :key="item.id"
              :label="item.project_name"
              :value="item.id"
            >
              <div>
                <a-tag color="red" v-if="item.saas === 'yes'">学科</a-tag>
                <a-tag color="blue" v-else>素质</a-tag>
                {{ item.project_name }}
              </div>
            </a-select-option>
          </a-select> -->
        </div>
      </template>
      <div>
        <div class="py-1"><InfoTag title="项目名称" :content="urlInfo.projectName" /></div>
        <div class="py-1">
          <InfoTag title="页面URL">
            <template #content>
              <a :href="urlInfo.boardURL" target="_blank">{{ urlInfo.boardURL }}</a>
            </template>
          </InfoTag>
        </div>
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
import { ref, onMounted, computed, onActivated } from 'vue'
import { getQuery } from '@vben/router'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import {
  PERFORMANCE_COLUMNS,
  PERFORMANCE_INDEX,
  STABILITY_COLUMNS,
  STABILITY_INDEX,
} from './config'
import { barFinColor } from '@vben/utils'
import InfoTag from '@/pages/component/infoCard/infoTag.vue'

import dayjs from 'dayjs'

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
  boardURL: '',
  reportTime: '',
})
const avgScore = computed(() => {
  const avg = (props.score.stabilityScore + props.score.performanceScore) / 2
  return avg.toFixed(0)
})

onMounted(() => {
  const { start_time, end_time, url: board_url, project_name } = getQuery()
  urlInfo.value = {
    projectName: decodeURIComponent(project_name as string),
    boardURL: decodeURIComponent(board_url as string),
    reportTime: `${start_time}至${dayjs(end_time as string)
      .subtract(1, 'd')
      .format('YYYY-MM-DD')}`,
  }
})
onActivated(() => {
  const { url } = getQuery()
  urlInfo.value.boardURL = decodeURIComponent(url as string)
})
</script>
