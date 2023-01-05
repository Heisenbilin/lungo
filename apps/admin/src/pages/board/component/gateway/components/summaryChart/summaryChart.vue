<template>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <a-tab-pane key="1" tab="请求成功率">
        <BaseChart
          :requestParams="requestParams1"
          :requestFunc="GatewayApis.getChartSummary"
          :getOptionFunc="getAmountChartOption"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="请求耗时">
        <BaseChart
          :requestParams="requestParams2"
          :requestFunc="GatewayApis.getChartSummary"
          :getOptionFunc="getTimeConsumingChartOption"
        />
      </a-tab-pane>
      <a-tab-pane key="3" tab="upstream请求成功率">
        <BaseChart
          :requestParams="requestParams3"
          :requestFunc="GatewayApis.getChartSummary"
          :getOptionFunc="getAmountChartOption"
        />
      </a-tab-pane>
      <a-tab-pane key="4" tab="upstream请求耗时">
        <BaseChart
          :requestParams="requestParams4"
          :requestFunc="GatewayApis.getChartSummary"
          :getOptionFunc="getTimeConsumingChartOption"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
//api异常数据汇总图表Tab框
import { ref, computed } from 'vue';
import { GatewayApis } from '/@/api/gateway';
import { boardStore } from '/@/store/modules/board';
import { getApiAmountChartOption, getTimeConsumingChartOption } from './summaryChartConfig';
import BaseChart from '/@/components/coreBoard/baseChart.vue';

const activeKey = ref('1');

const params = computed(() => ({
  project_id: boardStore.getBoardInfoState.id,
  start_time: boardStore.getFilterState.start_time,
  end_time: boardStore.getFilterState.end_time,
  summary_dimension: boardStore.getFilterState.dimension,
}));

const requestParams1 = computed(() => ({ ...params.value, summary_type: 'statusAmount' }));

const requestParams2 = computed(() => ({ ...params.value, summary_type: 'statusTimeConsuming' }));

const requestParams3 = computed(() => ({ ...params.value, summary_type: 'upstreamStatusAmount' }));

const requestParams4 = computed(() => ({
  ...params.value,
  summary_type: 'upstreamStatusTimeConsuming',
}));

const getAmountChartOption = data => getApiAmountChartOption(data, boardStore.getTimeFormatStr);
</script>
