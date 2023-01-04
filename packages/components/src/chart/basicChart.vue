<template>
  <div :class="className" ref="chartRef" :style="{ height, width }"></div>
</template>

<script setup lang="ts">
  import { Ref, watch, ref } from 'vue';
  import { useECharts } from '@vben/hooks';

  const props = defineProps({
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
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
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.chartOption,
    (obj) => {
      setOptions(obj);
      // 添加传入的鼠标事件
      if (Object.keys(props.bindFunctions).length) {
        const instance = getInstance();
        if (!instance) return;
        Object.keys(props.bindFunctions).forEach((key) => {
          instance.on(key, props.bindFunctions[key]);
        });
      }

      // 添加传入的zrender事件
      if (Object.keys(props.zrFunctions).length !== null) {
        const instance = getInstance();
        if (!instance) return;
        Object.keys(props.zrFunctions).forEach((key) => {
          instance.getZr().on(key, (params) => props.zrFunctions[key](params, instance));
        });
      }
    },
    { deep: true, immediate: true },
  );
</script>
