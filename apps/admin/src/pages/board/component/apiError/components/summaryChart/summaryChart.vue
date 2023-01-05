<template>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <template #tabBarExtraContent>
        <a-tag color="blue" class="!mt-2 filter-tag"> 单击筛选：时间范围</a-tag>
      </template>
      <a-tab-pane key="1" tab="异常量与异常率">
        <BaseChart
          :requestParams="requestParams1"
          :requestFunc="ApiErrorApis.getChartSummaryData"
          :getOptionFunc="getAmountChartOption"
          :zrFuncs="{ click: addTimeFilter }"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="请求耗时统计">
        <BaseChart
          :requestParams="requestParams2"
          :requestFunc="ApiErrorApis.getChartSummaryData"
          :getOptionFunc="getConsumingChartOption"
          :zrFuncs="{ click: addTimeFilter }"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
//api异常数据汇总图表Tab框
import { ref, computed } from 'vue';
import { ApiErrorApis } from '/@/api/board/apiError';
import { boardStore } from '/@/store/modules/board';
import { addTimeFilter } from '/@/components/boardNew/util/datePickerConfig';
import { getApiAmountChartOption, getTimeConsumingChartOption } from './summaryChartConfig';
import BaseChart from '/@/components/coreBoard/baseChart.vue';

//请求参数
const params = computed(() => ({
  project_id: `${boardStore.getBoardInfoState.id}`, //项目id
  start_time: boardStore.getFilterState.start_time, //开始时间
  end_time: boardStore.getFilterState.end_time, //结束时间
  dimension: boardStore.getFilterState.dimension, //维度
  url: boardStore.getFilterState.url, //路由筛选
  browser: boardStore.getFilterState.browser, //浏览器筛选
  device: boardStore.getFilterState.device, //设备筛选
  region: boardStore.getFilterState.region, //地区筛选
  network: boardStore.getFilterState.network, //网络类型筛选
  client: boardStore.getFilterState.client, //客户端筛选
  os: boardStore.getFilterState.os, //操作系统筛选
  api_status: boardStore.getFilterState.api_status, //api状态码筛选
  api_range: boardStore.getFilterState.api_range, //api耗时筛选
}));

const activeKey = ref('1');

// 成功率请求参数
const requestParams1 = computed(() => ({ ...params.value, summary_type: 'apiAmount' }));

// 耗时请求参数
const requestParams2 = computed(() => ({ ...params.value, summary_type: 'timeConsuming' }));

const getAmountChartOption = data => getApiAmountChartOption(data, boardStore.getTimeFormatStr);

const getConsumingChartOption = data =>
  getTimeConsumingChartOption(data, boardStore.getTimeFormatStr);
</script>
