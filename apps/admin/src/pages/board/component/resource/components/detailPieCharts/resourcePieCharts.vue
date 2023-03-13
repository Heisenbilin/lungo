<template>
  <div class="chart-container">
    <div class="chart-title">
      异常资源文件类型
      <a-tooltip
        :overlayStyle="{ maxWidth: '500px' }"
        title="异常资源（接入容错时指：未容错/容错失败资源）的文件类型"
      >
        <QuestionCircleOutlined />
      </a-tooltip>
      <a-tag color="blue" class="filter-tag"> 单击筛选：异常文件类型 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getFileTypeData"
      :getOptionFunc="getErrorTypeOption"
      :bindFuncs="{ click: addFilter }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">
      异常资源Top10
      <a-tooltip
        :overlayStyle="{ maxWidth: '500px' }"
        title="异常资源（接入容错时指：未容错/容错失败资源）Top10"
      >
        <QuestionCircleOutlined />
      </a-tooltip>
      <a-tag color="green" class="filter-tag"> 双击查看日志 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getTop10Data"
      :bindFuncs="{ dblclick: openLog }"
      :getOptionFunc="getTop10Option"
    />
  </div>
</template>

<script setup lang="ts">
//api异常详情相关饼图组件
import { computed } from 'vue'
import { getTop10Data, getFileTypeData } from '@/apis/board/resource'
import { getTop10Option, getErrorTypeOption } from '../../../util/pieChartConfig'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { logTypeEnum } from '@vben/constants'
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
  resource_type: boardStore.filterState.resource_type, //资源类型筛选
}))

// 资源类型设为筛选
const addFilter = title => {
  boardStore.addFilterValue({ resource_type: title.data.name })
}

//打开日志详情
const openLog = title => {
  boardStore.openLogInfoState({
    type: logTypeEnum.RESOURCE,
    visible: true,
    requestParams: {
      error_type: 'href',
      err_content: title.data.name,
    },
  })
}
</script>
