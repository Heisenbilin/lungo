<template>
  <template v-if="mustShow || uaCollapseState">
    <div class="chart-container">
      <div class="chart-title">
        用户浏览器类型
        <a-tag color="blue" class="filter-tag"> 单击筛选：网络 </a-tag>
      </div>

      <uaInfo type="browser" />
    </div>
    <div class="chart-container">
      <div class="chart-title">
        用户操作系统类型
        <a-tag color="blue" class="filter-tag"> 单击筛选：网络 </a-tag>
      </div>
      <uaInfo type="browser" />
    </div>
    <div class="chart-container-full">
      <div class="chart-title">
        用户地域分布 <a-tag color="blue" class="filter-tag"> 单击筛选：地域 </a-tag>
      </div>
      <BaseChart
        height="500px"
        :requestParams="requestParams"
        :requestFunc="getRegionData"
        :getOptionFunc="getUAMapOption"
        :bindFuncs="{ click: title => boardStore.addFilterValue({ province: title.data.name }) }"
      />
    </div>
    <div class="chart-container">
      <div class="chart-title">
        用户网络类型
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
        用户客户端类型 <a-tag color="blue" class="filter-tag"> 单击筛选：客户端 </a-tag>
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
        用户设备类型 <a-tag color="blue" class="filter-tag"> 单击筛选：设备 </a-tag>
      </div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getDeviceData"
        :getOptionFunc="getDeviceTypeOption"
        :bindFuncs="{ click: title => addFilter(title, 'device') }"
      />
    </div>
    <div class="chart-container">
      <div class="chart-title">用户分辨率类型</div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getResolutionData"
        :getOptionFunc="getResolutionOption"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getNetworkData,
  getDeviceData,
  getClientData,
  getResolutionData,
  getRegionData,
} from '@/apis/board/pv'
import {
  getNetworkTypeOption,
  getClientTypeOption,
  getDeviceTypeOption,
  getResolutionOption,
} from '@/logics/chartOption/pie'
import { getUAMapOption } from '@/logics/chartOption/map'
import { clientUserAgent } from '@vben/constants'
import { useBoardStore } from '@/store/modules/board'
import { BaseChart } from '@vben/components'
import uaInfo from './uaInfo.vue'

//页面质量周报稳定性组件
type Props = {
  modelType: 'pv' | 'performance' | 'runtime' | 'resource' | 'request'
  mustShow?: boolean
}

const props = defineProps<Props>()

const boardStore = useBoardStore()
const uaCollapseState = computed(() => boardStore.uaCollapseState)

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
  model_type: props.modelType, //模块类型
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
