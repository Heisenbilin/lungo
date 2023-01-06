<template>
  <BasicChart :chartOption="chartOption" />
</template>
<script setup lang="ts">
import { computed } from "vue";
import BasicChart from "./BasicChart.vue";
import { useWaterfallChartOption } from "@vben/hooks";
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const chartOption = computed(() => useWaterfallChartOption(props.content));
</script>
