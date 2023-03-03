<template>
  <div class="chart-container-full">
    <div class="chart-title">
      异常Top10 <a-tag color="green" class="filter-tag"> 双击查看日志 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :bindFuncs="{ dblclick: openLog }"
      :requestFunc="getTop10Data"
      :getOptionFunc="getChartOption"
    />
  </div>
</template>

<script setup lang="ts">
// 运行时异常详情相关饼图组件
import { computed } from 'vue'
import { getTop10Option } from '../../util/pieChartConfig'
import { useBoardStore } from '@/store/modules/board'
import { logTypeEnum } from '@vben/constants'
import { getTop10Data } from '@/apis/board/runtime'
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
}))

// 计算图表option
const getChartOption = data => getTop10Option(data, 60)

//打开日志详情
const openLog = title => {
  boardStore.openLogInfoState({
    type: logTypeEnum.RUNTIME,
    visible: true,
    requestParams: {
      error_content: title.data.name,
      error_type: 'content',
    },
  })
}
</script>
