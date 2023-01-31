<template>
  <div :class="className" ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts">
import { useECharts } from '@vben/hooks'
import { defineComponent, ref, watch, Ref } from 'vue'
export default defineComponent({
  props: {
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
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null)
    const { setOptions, setActions } = useECharts(chartRef as Ref<HTMLDivElement>)

    watch(
      () => props.chartOption,
      obj => {
        setOptions(obj)
        // 添加传入的鼠标事件
        setActions(props.bindFunctions, props.zrFunctions)
      },
      { deep: true, immediate: true },
    )

    return {
      chartRef,
    }
  },
})

// const props = defineProps({
//   className: {
//     type: String,
//     default: 'chart',
//   },
//   width: {
//     type: String,
//     default: '100%',
//   },
//   height: {
//     type: String,
//     default: '300px',
//   },
//   autoResize: {
//     type: Boolean,
//     default: true,
//   },
//   chartOption: {
//     type: Object,
//     required: true,
//     default: () => ({}),
//   },
//   bindFunctions: {
//     type: Object,
//     required: false,
//     default: () => ({}),
//   },
//   zrFunctions: {
//     type: Object,
//     required: false,
//     default: () => ({}),
//   },
// })

// const chartRef = ref<HTMLDivElement | null>(null)
// const { setOptions, setActions } = useECharts(chartRef as Ref<HTMLDivElement>)

// watch(
//   () => props.chartOption,
//   obj => {
//     setOptions(obj)
//     // 添加传入的鼠标事件
//     setActions(props.bindFunctions, props.zrFunctions)
//   },
//   { deep: true, immediate: true },
// )
</script>
