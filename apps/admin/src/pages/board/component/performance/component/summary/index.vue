<template>
  <div class="flex h-20 flex-row justify-center chart-container-full">
    <a-spin size="large" class="flex self-center" v-if="loading" />
    <template v-else>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="均值">
            首字节
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(averageData.firstbyte || '') }}</div>
          <div class="text-gray-500">ms</div>
        </div>
      </div>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="均值">
            DOM Ready
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(averageData.ready || '') }}</div>
          <div class="text-gray-500">ms</div>
        </div>
      </div>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="均值">
            页面完全加载
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(averageData.load || '') }}</div>
          <div class="text-gray-500">ms</div>
        </div>
      </div>
    </template>
  </div>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <template #rightExtra>
        <a-tag color="blue" class="!mt-2 filter-tag"> 单击筛选：时间范围</a-tag>
      </template>
      <a-tab-pane key="average" tab="性能均值">
        <BaseChart
          :requestParams="requestParams2"
          :requestFunc="getChartSummaryData"
          :getOptionFunc="getSummaryOption"
          :zrFuncs="{ click: addTimeFilter }"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey2" class="box-border w-full">
      <a-tab-pane key="waterfall" tab="页面加载均值瀑布图">
        <BaseChart
          :requestParams="requestParams"
          :requestFunc="requestAverageData"
          :getOptionFunc="useDataToWaterfallChartOption"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataToWaterfallChartOption } from '@vben/hooks'
import { getSummaryChartOption } from './chartConfig'
import { getChartSummaryData, getAverageData } from '@/apis/board/performance'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { commafy } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { BaseChart } from '@vben/components'
import { addTimeFilter } from '@/hooks/board/useDate'

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
  performance_key: boardStore.filterState.performance_key, //性能筛选
  performance_range: boardStore.filterState.performance_range, //性能筛选
}))

const requestParams2 = computed(() => ({
  ...requestParams.value,
  dimension: boardStore.filterState.dimension, //维度
}))

const activeKey = ref('average')
const activeKey2 = ref('waterfall')

const loading = ref(true)
const averageData = ref({
  firstbyte: '',
  dom: '',
  load: '',
  ready: '',
})

//从后端获取均值瀑布图数据方法
const getSummaryOption = data => getSummaryChartOption(data)

//从后端获取均值瀑布图数据方法
const requestAverageData = async params => {
  loading.value = true
  //拦截请求结果，存入averageData中
  const result = await getAverageData(params)
  averageData.value = result?.data ?? { firstbyte: '', dom: '', load: '', ready: '' }
  loading.value = false
  return result
}
</script>
