<template>
  <div :style="{ height: height }" class="flex justify-center items-center">
    <Spin size="large" v-if="loading" />
    <Empty v-else-if="chartOption === null" :image="simpleImage" />
    <BasicChart
      v-else
      :chartOption="chartOption"
      :bindFunctions="bindFuncs"
      :zrFunctions="zrFuncs"
      :height="height"
    />
  </div>
</template>

<script setup lang="ts">
import { Empty, Spin } from 'ant-design-vue'
import { computed, watch, ref } from 'vue'
import BasicChart from './BasicChart.vue'
const props = defineProps({
  //请求参数
  requestParams: Object,
  //图表事件
  bindFuncs: Object,
  zrFuncs: Object,
  //请求方法
  requestFunc: {
    type: Function,
    required: true,
  },
  //将请求结果处理成图表数据
  getOptionFunc: {
    type: Function,
    required: true,
  },
  //图表高度
  height: {
    type: String,
    default: '320px',
  },
})

const loading = ref<boolean>(true)
const chartData = ref(null)
const chartOption = computed(() => props.getOptionFunc(chartData.value))
watch(
  () => props.requestParams,
  async val => {
    loading.value = true
    try {
      const result = await props.requestFunc(val)
      if (result.stat === 1) chartData.value = result.data
      else chartData.value = null
    } catch {
      chartData.value = null
    } finally {
      loading.value = false
    }
  },
  { immediate: true, deep: true },
)
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>
