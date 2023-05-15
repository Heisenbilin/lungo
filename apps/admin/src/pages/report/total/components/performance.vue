<template>
  <h1>三、项目性能指标</h1>
  <div class="w-full p-4">
    <div class="chart-title">本周页面加载均值瀑布图</div>
    <div :style="{ height: '360px' }">
      <div class="h-full flex justify-center items-center" v-if="loading">
        <a-spin size="large" />
      </div>
      <a-empty
        v-else-if="currentWeekChartOption === null"
        class="h-full flex justify-center items-center"
        :image="simpleImage"
      />
      <BasicChart v-else :chartOption="currentWeekChartOption" height="360px" />
    </div>
  </div>
  <div class="w-full p-4">
    <div class="chart-title">上周页面加载均值瀑布图</div>
    <div :style="{ height: '360px' }">
      <div class="h-full flex-center" v-if="loading">
        <a-spin size="large" />
      </div>
      <a-empty
        v-else-if="lastWeekChartOption === null"
        class="h-full flex-center"
        :image="simpleImage"
      />
      <BasicChart v-else :chartOption="lastWeekChartOption" height="360px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDataToWaterfallChartOption } from '@vben/hooks'
import { getTwoWeeksPerformanceBoardDataReport } from '@/apis/report/index'
import { BasicChart } from '@vben/components'
import { useReportStore } from '@/store/modules/report'
import { Empty } from 'ant-design-vue'

const reportStore = useReportStore()
const requestParams = computed(() => ({
  project_id: `${reportStore.boardInfoState.id}`,
  start_time: reportStore.filterState.start_time,
  end_time: reportStore.filterState.end_time,
}))

const loading = ref<boolean>(true)
const chartData = ref<any>(null)
const currentWeekChartOption = computed(() =>
  useDataToWaterfallChartOption(chartData.value?.currentWeek ?? null),
)
const lastWeekChartOption = computed(() =>
  useDataToWaterfallChartOption(chartData.value?.lastWeek ?? null),
)

// 旧请求参数字符串，防止重复请求
let oldParamsString: string = ''

watch(
  () => requestParams,
  async val => {
    const newPramsString = JSON.stringify(val.value)
    if (newPramsString === oldParamsString) {
      loading.value = false
      return
    }
    oldParamsString = newPramsString
    loading.value = true
    try {
      const result = await getTwoWeeksPerformanceBoardDataReport(val.value)
      if (result.stat === 1) chartData.value = result.data
      else chartData.value = null
    } catch {
      chartData.value = null
    } finally {
      loading.value = false
    }
  },
  { immediate: true, deep: true },
)
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>

<style lang="scss" scoped>
h1 {
  font-size: 24px;
}

h2 {
  font-size: 18px;
  margin-left: 10px;
  padding-left: 9px;
  border-left: 4px #3161ca solid;
  display: inline;
}
</style>
