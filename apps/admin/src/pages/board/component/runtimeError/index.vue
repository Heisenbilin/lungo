<template>
  <div class="grid grid-cols-2 gap-3">
    <SummaryData />
    <ResultTabs />
    <DetailPieCharts />
  </div>
</template>

<script setup>
import SummaryData from './components/summary/summaryData.vue';
import ResultTabs from './components/resultTable/resultTabs.vue';
import DetailPieCharts from './components/detailPieCharts.vue';
</script>
