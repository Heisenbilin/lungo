<template>
  <div class="chart-container-full">
    <div class="chart-title">
      地域分布 <a-tag color="blue" class="filter-tag"> 单击筛选：地域 </a-tag>
    </div>
    <BaseChart
      height="500px"
      :requestParams="requestParams"
      :requestFunc="getRegionData"
      :getOptionFunc="getUAMapOption"
      :bindFuncs="{ click: title => boardStore.addFilterValue({ province: title.data.name }) }"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getRegionData } from '@/apis/board/pv'
import { getUAMapOption } from '@/logics/chartOption/map'
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
</script>
