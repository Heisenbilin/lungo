<template>
  <div class="flex h-20 flex-row justify-center chart-container-full"
    :style="{ 'background-color': isDark ? 'rgb(20,20,20)' : '' }">
    <a-spin size="large" class="flex self-center" v-if="loading" />
    <template v-else>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">请求总数</div>
        <div class="text-3xl font-medium">{{ commafy(summaryData.total) }}</div>
      </div>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip :overlayStyle="{ maxWidth: '400px' }">
            <template #title>
              计算规则：请求成功数/请求总数<br />
              成功请求：请求响应码在200-300区间或响应码为304
            </template>
            成功率
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">
            {{ summaryData.successRate }}
          </div>
          <div class="text-gray-500">%</div>
        </div>
      </div>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">平均耗时</div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ summaryData.averageTime }}</div>
          <div class="text-gray-500">ms</div>
        </div>
      </div>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">失败请求数</div>
        <div class="text-3xl font-medium">{{ commafy(summaryData.error) }}</div>
      </div>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">影响用户数</div>
        <div class="text-3xl font-medium">{{ commafy(summaryData.errUserCount) }}</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
//api异常数据汇总组件
import { ref, watch, computed } from 'vue'
import { getSummaryData } from '@/apis/board/apiError'
import { commafy } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useAppTheme } from '@vben/hooks';
const { isDark } = useAppTheme()

const boardStore = useBoardStore()

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  url: boardStore.filterState.url, //路由筛选
  browser: boardStore.filterState.browser, //浏览器筛选
  device: boardStore.filterState.device, //设备筛选
  province: boardStore.filterState.province, //地区筛选
  network: boardStore.filterState.network, //网络类型筛选
  client: boardStore.filterState.client, //客户端筛选
  os: boardStore.filterState.os, //操作系统筛选
  api_status: boardStore.filterState.api_status, //api状态码筛选
  api_range: boardStore.filterState.api_range, //api耗时筛选
}))

const loading = ref(true)
const summaryData = ref({
  total: '',
  error: '',
  errUserCount: '',
  successRate: '',
  averageTime: '',
})

const requestSummaryData = async () => {
  loading.value = true
  const result = await getSummaryData(requestParams.value)
  summaryData.value = result?.data
    ? {
      total: result.data.total,
      error: result.data.error,
      errUserCount: result.data.error_uv,
      averageTime: result.data.averageTime,
      successRate: result.data.total
        ? ((result.data.success * 100) / result.data.total).toFixed(2)
        : '0',
    }
    : { total: '', error: '', errUserCount: '', successRate: '', averageTime: '' }
  loading.value = false
}

watch(requestParams, requestSummaryData, { immediate: true })
</script>
