<template>
  <div :class="className"  ref="chartRef" :style="{ height, width }"></div>
</template>

<script setup lang="ts">
import { Ref, watch, ref, onActivated } from 'vue'
import { useECharts } from '@vben/hooks'
import { useAppTheme } from '@vben/hooks'
const {isDark } = useAppTheme()

const props = defineProps({
  className: {
    type: String,
    default: 'chart',
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '300px',
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  chartOption: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  bindFunctions: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  zrFunctions: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions, setActions, resize } = isDark ? useECharts(chartRef as Ref<HTMLDivElement>,"dark") : useECharts(chartRef as Ref<HTMLDivElement>)
// console.log(isDark)
onActivated(() => {
  resize()
})

watch(
  () => props.chartOption,
  obj => {
    setOptions(obj)
    // 添加传入的鼠标事件
    setActions(props.bindFunctions, props.zrFunctions)
  },
  { deep: true, immediate: true },
)
</script>
