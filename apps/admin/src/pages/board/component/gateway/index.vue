<template>
  <div class="grid grid-cols-2 gap-3">
    <SummaryNumber />
    <SummaryChart />
    <ResultTabs />
    <DetailPieCharts />
  </div>
</template>

<script setup>
//网关监控Tab页
import SummaryNumber from './components/summaryNumber.vue';
import SummaryChart from './components/summaryChart/summaryChart.vue';
import ResultTabs from './components/resultTable/resultTabs.vue';
import DetailPieCharts from './components/detailPieCharts.vue';
</script>
