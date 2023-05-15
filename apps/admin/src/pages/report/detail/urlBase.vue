<template>
  <div class="chart-container-full">
    <div class="text-center text-2xl">项目信息</div>
    <div>
      <span class="info-title">项目名称：</span>
      <span class="info-content">{{ urlInfo.projectName }}</span>
    </div>
    <div>
      <span class="info-title">页面URL：</span>
      <span class="info-content">
        <a :href="urlInfo.boardURL" target="_blank">{{ urlInfo.boardURL }}</a>
      </span>
    </div>
    <div>
      <span class="info-title">报告时间：</span>
      <span class="info-content">{{ urlInfo.reportTime }}</span>
    </div>
  </div>

  <div class="flex h-20 flex-row justify-center chart-container-full">
    <div class="w-1/5 grid justify-items-center content-center space-y-1">
      <div class="text-gray-500">
        <a-tooltip :overlayStyle="{ maxWidth: '400px' }">
          <template #title>
            <ul>
              <li>总评分数 = (性能评分+稳定性评分) / 2 。</li>
              <li>
                性能与稳定性都非常重要，开发者需充分考虑性能与稳定性两方面的质量，避免出现“偏科”的情况。
              </li>
            </ul>
          </template>
          总评分数
          <QuestionCircleOutlined />
        </a-tooltip>
      </div>
      <div class="flex items-end">
        <div class="text-3xl font-medium">{{ avgScore || 0 }}</div>
      </div>
    </div>
    <div class="w-1/5 grid justify-items-center content-center space-y-1">
      <div class="text-gray-500">性能得分</div>
      <div class="text-3xl font-medium">{{ score.performanceScore }}</div>
    </div>
    <div class="w-1/5 grid justify-items-center content-center space-y-1">
      <div class="text-gray-500">稳定性得分</div>
      <div class="text-3xl font-medium">{{ score.stabilityScore }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onActivated } from 'vue'
import { getQuery } from '@vben/router'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
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
  // window.scrollTo(0, 0)
  // document.body.scrollTop = 0
  // document.documentElement.scrollTop = 0
  // document.scrollingElement.scrollTop = 0
  // console.log(document.body.scrollTop, document.documentElement.scrollTop);
})
</script>
