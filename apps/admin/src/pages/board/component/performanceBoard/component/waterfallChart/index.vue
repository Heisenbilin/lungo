<template>
  <BasicChart :chartOption="chartOption" />
</template>
<script setup lang="ts">
import { computed } from "vue";
import { BasicChart } from "@vben/components";
import { getWaterfallChartOption } from "./chartConfig";
const props = defineProps({
  content: Object,
});

const chartOption = computed(() => getWaterfallChartOption(props.content));
</script>
