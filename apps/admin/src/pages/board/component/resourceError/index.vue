<template>
  <div class="grid grid-cols-2 gap-3">
    <SummaryData :faultTolerantStatus="faultTolerantStatus" />
    <ResultTabs :faultTolerantStatus="faultTolerantStatus" />
    <ResourcePieCharts />
    <FaultTolerantPieCharts :faultTolerantStatus="faultTolerantStatus" />
  </div>
</template>

<script setup lang="ts">
//resource异常Tab页
import { ref, watch } from "vue";
import { checkResourceStatus } from "@/apis/report";
// import { ResourceApis } from '/@/api/board/resource';
import { useBoardStore } from "@/store/modules/board";

import SummaryData from "./components/summary/summaryData.vue";
import ResultTabs from "./components/resultTable/resultTabs.vue";
import ResourcePieCharts from "./components/detailPieCharts/resourcePieCharts.vue";
import FaultTolerantPieCharts from "./components/detailPieCharts/faultTolerantPieCharts.vue";

const boardStore = useBoardStore();

// 容错接入状态
const faultTolerantStatus = ref("noData");

watch(
  () => ({
    project_id: boardStore.boardInfoState.id,
    start_time: boardStore.filterState.start_time,
    end_time: boardStore.filterState.end_time,
  }),
  async (val) => {
    const result = await checkResourceStatus(val);
    if (result.stat === 1) {
      faultTolerantStatus.value = result.data.resourceResult === true ? "accessed" : "notAccess";
    }
  },
  { immediate: true }
);
</script>
