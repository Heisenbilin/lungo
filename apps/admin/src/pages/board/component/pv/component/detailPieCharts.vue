<template>
  <div class="chart-container">
    <div class="chart-title">
      网络类型
      <a-tag color="blue" class="filter-tag"> 单击筛选：网络 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getNetworkData"
      :getOptionFunc="getNetworkTypeOption"
      :bindFuncs="{ click: title => addFilter(title, 'network') }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">
      客户端类型 <a-tag color="blue" class="filter-tag"> 单击筛选：客户端 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getClientData"
      :getOptionFunc="getClientTypeOption"
      :bindFuncs="{ click: title => addFilter(title, 'client') }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">
      设备类型 <a-tag color="blue" class="filter-tag"> 单击筛选：设备 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getDeviceData"
      :getOptionFunc="getDeviceTypeOption"
      :bindFuncs="{ click: title => addFilter(title, 'device') }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getNetworkData, getDeviceData, getClientData } from '@/apis/board/pv'
import {
  getNetworkTypeOption,
  getClientTypeOption,
  getDeviceTypeOption,
} from '../../util/pieChartConfig'
import { clientUserAgent } from '@vben/constants'
import { useBoardStore } from '@/store/modules/board'
import { BaseChart } from '@vben/components'

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

const addFilter = (title, key) => {
  console.log(title)
  const name =
    key === 'client'
      ? `${
          Object.keys(clientUserAgent).find(key => clientUserAgent[key] === title.data.name) ??
          '未知'
        }`
      : title.data.name
  boardStore.addFilterValue({ [key]: name })
}
</script>
