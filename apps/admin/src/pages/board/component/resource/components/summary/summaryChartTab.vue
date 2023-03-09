<template>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <a-tab-pane key="summary" tab="异常量与异常率">
        <BaseChart
          :requestParams="requestParams"
          :requestFunc="getErrorChart"
          :getOptionFunc="getSummaryOption"
          :zrFuncs="{ click: addTimeFilter }"
        />
      </a-tab-pane>
      <template #rightExtra>
        <div class="!mt-3 leading-3">
          <span v-if="faultTolerantStatus === 'accessed'" :style="'color: #3aa272'">
            资源容错已接入,
            <a
              href="http://app.xesv5.com/doc/pages/fedata/url-fallback/intro.html#%E4%BB%8B%E7%BB%8D"
              target="_blank"
            >
              查看资源容错文档
            </a>
          </span>
          <span v-if="faultTolerantStatus === 'notAccess'" :style="'color: #ee6666'">
            没有查询到该时间段内的资源容错数据,
            <a
              href="http://app.xesv5.com/doc/pages/fedata/url-fallback/intro.html#%E4%BB%8B%E7%BB%8D"
              target="_blank"
            >
              查看资源容错文档
            </a>
          </span>
          <a-tag color="blue" class="!ml-10 !-mt-1 filter-tag"> 单击筛选：时间范围</a-tag>
        </div>
      </template>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
//resource异常数据汇总组件
import { ref, computed } from 'vue'
import { getErrorChart } from '@/apis/board/resource'
import { getFaultTolerantChartOption } from './summaryChartConfig'
import { useBoardStore } from '@/store/modules/board'
import { addTimeFilter } from '@/hooks/board/useDate'
import { BaseChart } from '@vben/components'
import { useAppTheme } from '@vben/hooks'
const { isDark } = useAppTheme()
const boardStore = useBoardStore()

const props = defineProps({
  faultTolerantStatus: {
    type: String,
    required: true,
  },
})

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  dimension: boardStore.filterState.dimension, //维度
  url: boardStore.filterState.url, //路由筛选
  browser: boardStore.filterState.browser, //浏览器筛选
  device: boardStore.filterState.device, //设备筛选
  province: boardStore.filterState.province, //地区筛选
  network: boardStore.filterState.network, //网络类型筛选
  client: boardStore.filterState.client, //客户端筛选
  os: boardStore.filterState.os, //操作系统筛选
  resource_type: boardStore.filterState.resource_type, //资源类型筛选
}))

const activeKey = ref('summary')

const getSummaryOption = data =>
  getFaultTolerantChartOption(data, props.faultTolerantStatus === 'accessed')
</script>
