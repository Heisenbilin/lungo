<template>
  <div class="chart-container" :style="{ 'background-color': isDark ? 'rgb(20,20,20)' : '' }">
    <div class="chart-title">
      异常资源域名分布
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }" title="异常资源（接入容错时指：未容错/容错失败资源）的文件url中的域名分布情况">
        <QuestionCircleOutlined />
      </a-tooltip>
    </div>
    <BaseChart :requestParams="requestParams" :requestFunc="getErrorHrefData" :getOptionFunc="getFaultTolerantOption" />
  </div>
  <div class="chart-container" :style="{ 'background-color': isDark ? 'rgb(20,20,20)' : '' }"
    v-if="props.faultTolerantStatus === 'accessed'">
    <div class="chart-title">
      容错成功资源域名分布
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }" title="容错成功资源的文件url中的域名分布情况">
        <QuestionCircleOutlined />
      </a-tooltip>
    </div>
    <BaseChart :requestParams="requestParams" :requestFunc="getFErrorData" :getOptionFunc="getFaultTolerantOption" />
  </div>
  <div class="chart-container" :style="{ 'background-color': isDark ? 'rgb(20,20,20)' : '' }"
    v-if="props.faultTolerantStatus === 'accessed'">
    <div class="chart-title">
      容错次数
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }" title="容错成功历经的容错次数">
        <QuestionCircleOutlined />
      </a-tooltip>
      <a-tag color="green" class="filter-tag"> 双击查看日志 </a-tag>
    </div>
    <BaseChart :requestParams="requestParams" :requestFunc="getFTimesData" :bindFuncs="{ dblclick: openLog }"
      :getOptionFunc="getFaultTolerantTimesOption" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getErrorHrefData, getFErrorData, getFTimesData } from '@/apis/board/resource'
import { getFaultTolerantOption, getFaultTolerantTimesOption } from '../../../util/pieChartConfig'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { logTypeEnum } from '@vben/constants'
import { useBoardStore } from '@/store/modules/board'
import { BaseChart } from '@vben/components'
import { useAppTheme } from '@vben/hooks'
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
  resource_type: boardStore.filterState.resource_type, //资源类型筛选
}))

// api异常详情相关饼图组件
const props = defineProps({
  faultTolerantStatus: {
    type: String,
    required: true,
  },
})

// 打开日志详情
const openLog = title => {
  const times = title.data.name.split('次')[0]
  boardStore.openLogInfoState({
    type: logTypeEnum.FAULTTOLERANT,
    visible: true,
    requestParams: {
      fault_tolerant_count: times,
    },
  })
}
</script>
