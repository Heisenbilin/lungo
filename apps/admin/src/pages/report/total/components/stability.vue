<template>
  <div class="chart-container">
    <div class="chart-title">
      运行时异常（总异常量:
      <span class="text-red-500"> {{ runtimeTotal }} </span>）
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="params => getTwoWeeksSummaryReport({ ...params, board_type: 'runtime' })"
      :getOptionFunc="data => getTwoWeeksOption(data, 'runtime')"
      height="360px"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">
      资源异常（总异常量:
      <span class="text-red-500"> {{ resourceTotal }} </span>）
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="params => getTwoWeeksSummaryReport({ ...params, board_type: 'resource' })"
      :getOptionFunc="data => getTwoWeeksOption(data, 'resource')"
      height="360px"
    />
  </div>

  <div class="chart-container">
    <div class="chart-title">运行时异常Top10</div>
    <BaseChart
      :requestParams="requestParams"
      :bindFuncs="{
        click: title => openRuntimeLogDrawer(title.data.name, 'content'),
      }"
      :requestFunc="getRuntimeTopReport"
      :getOptionFunc="getTop10Option"
    />
  </div>

  <div class="chart-container">
    <div class="chart-title">运行时异常Top10 URL</div>
    <BaseChart
      :requestParams="requestParams"
      :bindFuncs="{
        click: title => openRuntimeLogDrawer(title.data.name, 'domain'),
      }"
      :requestFunc="getRuntimeUrlReport"
      :getOptionFunc="getTop10Option"
    />
  </div>

  <div class="chart-container">
    <div class="chart-title">资源异常Top10</div>
    <BaseChart
      :requestParams="requestParams"
      :bindFuncs="{
        click: title => openResourceLogDrawer(title.data.name, 'href'),
      }"
      :requestFunc="getResourceTopReport"
      :getOptionFunc="getTop10Option"
    />
  </div>

  <div class="chart-container">
    <div class="chart-title">资源异常Top10 URL</div>
    <BaseChart
      :requestParams="requestParams"
      :bindFuncs="{
        click: title => openResourceLogDrawer(title.data.name, 'domain'),
      }"
      :requestFunc="getResourceUrlReport"
      :getOptionFunc="getTop10Option"
    />
  </div>

  <div class="chart-container">
    <div class="chart-title">接口异常Top10</div>
    <BaseChart
      :requestParams="requestParams"
      :bindFuncs="{ click: openApiTop10Log }"
      :requestFunc="getInterfaceTopReport"
      :getOptionFunc="getTop10Option"
    />
  </div>

  <div class="chart-container">
    <div class="chart-title">接口耗时统计</div>
    <BaseChart
      :requestParams="requestParams"
      :bindFuncs="{ click: openApiCostTimeLog }"
      :requestFunc="getCostTimeReport"
      :getOptionFunc="getCostTimeChartOption"
    />
  </div>
  <LogDrawer boardType="report" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  getTwoWeeksSummaryReport,
  getRuntimeTopReport,
  getRuntimeUrlReport,
  getResourceTopReport,
  getResourceUrlReport,
  getInterfaceTopReport,
  getCostTimeReport,
} from '@/apis/report/index'
import { getErrorTotalSummary } from '@/apis/report/apis'
import { getTwoWeeksOption } from '../utils/configs'
import { getCostTimeChartOption, getTop10Option } from '@/logics/chartOption/pie'
import { commafy } from '@vben/utils'
import { logTypeEnum } from '@vben/constants'
import { BaseChart } from '@vben/components'
import { useReportStore } from '@/store/modules/report'
import LogDrawer from '@/pages/component/logDetail/logDrawer.vue'

const boardStore = useReportStore()

const resourceTotal = ref('')
const runtimeTotal = ref('')

const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`,
  start_time: boardStore.filterState.start_time,
  end_time: boardStore.filterState.end_time,
}))

//后台数据获取与处理
async function initData() {
  //异常总数 数据获取与处理
  let result = await getErrorTotalSummary(requestParams.value)
  if (result.stat === 1 && Object.keys(result.data).length) {
    resourceTotal.value = commafy(result.data.resourceTotal)
    runtimeTotal.value = commafy(result.data.runtimeTotal)
  } else {
    resourceTotal.value = runtimeTotal.value = ''
  }
}

watch(() => requestParams, initData, { immediate: true })

/*
 *  LogDrawer
 */

// 打开runtime异常抽屉
const openRuntimeLogDrawer = (error_content, error_type) => {
  boardStore.openLogInfoState({
    type: logTypeEnum.RUNTIME,
    visible: true,
    requestParams: { error_content, error_type },
  })
}

// 打开resource异常抽屉
const openResourceLogDrawer = (err_content, error_type) => {
  boardStore.openLogInfoState({
    type: logTypeEnum.RESOURCE,
    visible: true,
    requestParams: { error_type, err_content },
  })
}

// 打开API异常 CostTime 抽屉
const openApiCostTimeLog = title => {
  const [from, to] = title.data.name.split(' to ')
  boardStore.openLogInfoState({
    type: logTypeEnum.API,
    visible: true,
    requestParams: { range_start: from, range_end: to },
  })
}
// 打开API异常 top10 抽屉
const openApiTop10Log = title => {
  boardStore.openLogInfoState({
    type: logTypeEnum.API,
    visible: true,
    requestParams: { request_url: title.data.name, response_type: 'fail' },
  })
}
</script>

<style lang="scss" scoped>
.stability-title {
  > h1 {
    font-size: 24px;
    float: left;
  }
  .access-status {
    float: right;
    font-size: 16px;
    line-height: 40px;
  }
}
</style>
