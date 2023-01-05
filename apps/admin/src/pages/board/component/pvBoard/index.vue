<template>
  <div class="grid grid-cols-2 gap-3">
    <PVUVSummary />
    <UrlTable />
    <div class="bg-white rounded-lg p-3">
      <div class="chart-title">浏览器类型</div>
      <uaInfo type="browser" />
    </div>
    <div class="bg-white rounded-lg p-3">
      <div class="chart-title">操作系统类型</div>
      <uaInfo type="os" />
    </div>
    <UAMap />
    <DetailPieCharts />
  </div>
</template>

<script setup>
//通用看板组件
import PVUVSummary from './component/pvuvsummary.vue';
import uaInfo from './component/uaInfo/index.vue';
import UrlTable from './component/urlTable/urlTable.vue';
import UAMap from './component/uaMap/index.vue';
import DetailPieCharts from './component/detailPieCharts.vue';
</script>
