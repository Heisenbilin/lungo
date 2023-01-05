<template>
  <div class="chart-container">
    <div class="chart-title">请求响应码</div>
    <BaseChart
      :requestParams="requestParams1"
      :requestFunc="GatewayApis.getStatusSummary"
      :getOptionFunc="getStatusChartOption"
      :bindFuncs="{ click: title => openStatusLog(title, 'status') }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">upstream响应码</div>
    <BaseChart
      :requestParams="requestParams2"
      :requestFunc="GatewayApis.getStatusSummary"
      :getOptionFunc="getStatusChartOption"
      :bindFuncs="{ click: title => openStatusLog(title, 'upstream') }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">请求耗时统计</div>
    <BaseChart
      :requestParams="requestParams1"
      :requestFunc="GatewayApis.getCostTime"
      :getOptionFunc="getGateWayCostTimeChartOption"
      :bindFuncs="{ click: title => openCostTimeLog(title, 'status') }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">upstream耗时统计</div>
    <BaseChart
      :requestParams="requestParams2"
      :requestFunc="GatewayApis.getCostTime"
      :getOptionFunc="getGateWayCostTimeChartOption"
      :bindFuncs="{ click: title => openCostTimeLog(title, 'upstream') }"
    />
  </div>
</template>

<script setup>
//api异常详情相关饼图组件
import { computed } from 'vue';
import { GatewayApis } from '/@/api/gateway';
import { boardStore } from '/@/store/modules/board';
import { getStatusChartOption, getGateWayCostTimeChartOption } from '../../util/pieChartConfig';
import { logTypeEnum } from '/@/enums/boardEnum';
import BaseChart from '/@/components/coreBoard/baseChart.vue';

const params = computed(() => ({
  project_id: boardStore.getBoardInfoState.id,
  start_time: boardStore.getFilterState.start_time,
  end_time: boardStore.getFilterState.end_time,
}));

const requestParams1 = computed(() => ({ ...params.value, status_type: 'gateway' }));
const requestParams2 = computed(() => ({ ...params.value, status_type: 'upstream' }));

//打开日志详情
const openStatusLog = (title, type) => {
  if (title.data.name === '未知') {
    title.data.name = 'unknown';
  }
  boardStore.openLogInfoState({
    type: logTypeEnum.GATEWAY,
    visible: true,
    requestParams: {
      response_status: title.data.name,
      details_type: type,
    },
  });
};

const openCostTimeLog = (title, type) => {
  const [from, to] = title.data.name.split(' to ');
  boardStore.openLogInfoState({
    type: logTypeEnum.GATEWAY,
    visible: true,
    requestParams: {
      range_start: from,
      range_end: to,
      details_type: type,
    },
  });
};
</script>
