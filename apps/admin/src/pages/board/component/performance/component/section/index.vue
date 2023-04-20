<template>
  <div class="chart-container-full">
    <div class="chart-title">
      性能指标PV分布
      <span class="!mr-10 float-right">
        <a-radio-group size="small" v-model:value="label" button-style="solid">
          <template v-for="item in lableList" :key="item.value">
            <a-radio-button :value="item.value">{{ item.label }}</a-radio-button>
          </template>
        </a-radio-group>
      </span>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getSectionData"
      :getOptionFunc="getSectionChartOption"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getSectionChartOption } from './chartConfig'
import { getSectionData } from '@/apis/board/performance'
import { useBoardStore } from '@/store/modules/board'
import { BaseChart } from '@vben/components'

const boardStore = useBoardStore()
const label = ref('load')

const lableList = [
  { label: '页面完全加载', value: 'load' },
  { label: '首字节', value: 'firstbyte' },
  { label: 'DOM Ready', value: 'ready' },
]

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  section_type: label.value, //性能指标
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
