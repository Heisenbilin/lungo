<template>
  <BasicChart :chartOption="chartOption" />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { default as BasicChart } from './basicChart.vue'
import { useWaterfallChartOption } from '@vben/hooks'
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})

const chartOption = computed(() => useWaterfallChartOption(props.content))
</script>
