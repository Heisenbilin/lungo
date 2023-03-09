<template>
  <div class="chart-container-full">
    <div class="chart-title">
      <a-select class="!mr-2" v-model:value="chartName">
        <template v-for="(value, key) in boardConfigs" :key="key">
          <a-select-option :value="key">{{ value.name }}</a-select-option>
        </template>
      </a-select>
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }" placement="right">
        <template #title>
          <span class="whitespace-pre-wrap ml-3">{{ boardConfigs[chartName].description }}</span>
        </template>
        <QuestionCircleOutlined />
      </a-tooltip>
      <a-tag color="blue" class="filter-tag"> 单击筛选：{{ chartName }}耗时、时间范围 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getChartDataFuncs[boardConfigs[chartName].type - 1]"
      :getOptionFunc="getChartOptionFuncs[boardConfigs[chartName].type - 1]"
      :bindFuncs="{ click: addFilter }"
      :zrFuncs="{ click: addTimeFilter }"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
// import { useStore } from "vuex";
import { getTimeSlotDataByType, getChartData } from '@/apis/board/sourceMap'
import { boardConfigs, getPerformanceChartOption } from './performanceChartsConfig'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { addTimeFilter } from '@/hooks/board/useDate'
import { useBoardStore } from '@/store/modules/board'
import { BaseChart } from '@vben/components'
import { useUserStore } from '@/store/user'
import { useAppTheme } from '@vben/hooks'
const { isDark } = useAppTheme()

const boardStore = useBoardStore()
const userStore = useUserStore()
const userName = userStore.userInfo?.account || ''

const requestParams = ref<any>({
  boardid: '0x000',
  filter: {
    gteTime: boardStore.filterState.start_time,
    lteTime: boardStore.filterState.end_time,
    boardType: 'dns',
  },
  projectid: `${boardStore.boardInfoState.id}`,
  userid: userName,
})

const chartName = ref('dns')

watch(chartName, val => {
  console.log(val)
  if (boardConfigs[val].type === 1) {
    delete requestParams.value.estask_list
    requestParams.value.filter.boardType = val
  } else {
    delete requestParams.value.filter.boardType
    requestParams.value.estask_list = [boardConfigs[val].apiName]
  }
})

// 数据清洗成图表option方法
const getChartOptionFuncs = [
  data => getPerformanceChartOption(data, boardStore.getTimeFormatStr, chartName.value),
  data => getPerformanceChartOption(data, boardStore.getTimeFormatStr, undefined),
]

// 获取数据api
const getChartDataFuncs = [getTimeSlotDataByType, getChartData]

const addFilter = title => {
  if (title.seriesType !== 'pie') return
  const range = title.data.name.split(' to ')
  if (range.length === 2) {
    boardStore.addFilterValue({
      performance_key: chartName,
      performance_range: range.map(item => (item = parseInt(item))),
    })
  }
}
</script>
