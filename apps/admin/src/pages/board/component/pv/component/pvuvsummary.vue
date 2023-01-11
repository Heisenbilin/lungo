<template>
  <div class="chart-container-full flex h-20 flex-row justify-center">
    <a-spin size="large" class="flex self-center" v-if="loading.pv || loading.uv" />
    <template v-else>
      <div class="w-1/4 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">总PV数</div>
        <div class="text-3xl font-medium">{{ commafy(totalCount.PVCount) }}</div>
      </div>
      <div class="w-1/4 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">总UV数</div>
        <div class="text-3xl font-medium">{{ commafy(totalCount.UVCount) }}</div>
      </div>
    </template>
  </div>
  <div class="chart-container">
    <div class="chart-title">
      PV <a-tag color="blue" class="filter-tag"> 单击筛选：时间范围 </a-tag>
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
        <template #title>
          即 page view，页面浏览量或点击量。<br />用来衡量网站用户访问的网页数量。
        </template>
        <QuestionCircleOutlined />
      </a-tooltip>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="requestPageViewData"
      :getOptionFunc="getChartOption"
      :zrFuncs="{ click: addTimeFilter }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">
      UV <a-tag color="blue" class="filter-tag"> 单击筛选：时间范围 </a-tag>
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
        <template #title>
          即 unique visitor，独立访客数。<br />用来统计1天内访问某站点的用户数。
        </template>
        <QuestionCircleOutlined />
      </a-tooltip>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="requestUserViewData"
      :getOptionFunc="getChartOption"
      :zrFuncs="{ click: addTimeFilter }"
    />
  </div>
</template>

<script setup lang="ts">
// pv与uv图表
import { computed, reactive } from 'vue'
import { getPVUVChartOption } from './chartsConfig'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { getPageViewData, getUserViewData } from '@/apis/board/pv'
import { useBoardStore } from '@/store/modules/board'
import { commafy } from '@vben/utils'
import { addTimeFilter } from '@/hooks/board/useDate'
import { BaseChart } from '@vben/components'

const boardStore = useBoardStore()

const loading = reactive({ pv: true, uv: true })
const totalCount = reactive({ PVCount: '', UVCount: '' })

const requestPageViewData = async params => {
  loading.pv = true
  const result = await getPageViewData(params)
  totalCount.PVCount =
    result?.data?.length > 0 ? result.data.reduce((pre, cur) => pre + cur.count, 0) : ''
  loading.pv = false
  return result
}

const requestUserViewData = async params => {
  loading.uv = true
  const result = await getUserViewData(params)
  totalCount.UVCount =
    result?.data?.length > 0 ? result.data.reduce((pre, cur) => pre + cur.count, 0) : ''
  loading.uv = false
  return result
}

// 请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  dimension: boardStore.filterState.dimension, //维度
  url: boardStore.filterState.url, //路由筛选
  browser: boardStore.filterState.browser, //浏览器筛选
  device: boardStore.filterState.device, //设备筛选
  region: boardStore.filterState.region, //地区筛选
  network: boardStore.filterState.network, //网络类型筛选
  client: boardStore.filterState.client, //客户端筛选
  os: boardStore.filterState.os, //操作系统筛选
  performance_key: boardStore.filterState.performance_key, //性能筛选
  performance_range: boardStore.filterState.performance_range, //性能筛选
}))

// 获取图表option(PV、UV图表共用)
const getChartOption = data => getPVUVChartOption(data, boardStore.getTimeFormatStr)
</script>
