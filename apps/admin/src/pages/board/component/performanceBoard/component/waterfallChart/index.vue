<template>
  <BasicChart :chartOption="chartOption" />
</template>
<script setup>
import { computed } from 'vue';
import BasicChart from '/@/components/coreBoard/charts/basicChart.vue';
import { getWaterfallChartOption } from './chartConfig';
const props = defineProps({
  content: Object,
});

const chartOption = computed(() => getWaterfallChartOption(props.content));
</script>
