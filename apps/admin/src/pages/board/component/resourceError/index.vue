<template>
  <div class="grid grid-cols-2 gap-3">
    <SummaryData :faultTolerantStatus="faultTolerantStatus" />
    <ResultTabs :faultTolerantStatus="faultTolerantStatus" />
    <ResourcePieCharts />
    <FaultTolerantPieCharts :faultTolerantStatus="faultTolerantStatus" />
  </div>
</template>

<script setup>
//resource异常Tab页
import { ref, watch } from 'vue';
import { reportApis } from '/@/api/littleSquirrel';
// import { ResourceApis } from '/@/api/board/resource';
import { boardStore } from '/@/store/modules/board';

import SummaryData from './components/summary/summaryData.vue';
import ResultTabs from './components/resultTable/resultTabs.vue';
import ResourcePieCharts from './components/detailPieCharts/resourcePieCharts.vue';
import FaultTolerantPieCharts from './components/detailPieCharts/faultTolerantPieCharts.vue';

// 容错接入状态
const faultTolerantStatus = ref('noData');

watch(
  () => ({
    project_id: boardStore.getBoardInfoState.id,
    start_time: boardStore.getFilterState.start_time,
    end_time: boardStore.getFilterState.end_time,
  }),
  async val => {
    const result = await reportApis.checkResourceStatus(val);
    if (result.stat === 1) {
      faultTolerantStatus.value = result.data.resourceResult === true ? 'accessed' : 'notAccess';
    }
  },
  { immediate: true }
);
</script>
