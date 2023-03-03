<template>
  <BaseChart
    :requestParams="requestParams"
    :requestFunc="getUAData"
    :getOptionFunc="getChartOption"
    :bindFuncs="{ click: handleUAClick }"
    height="400px"
  />
  <template v-if="uaName.length">
    <div class="text-center mt-6 text-gray-600 text-lg">
      {{ uaName }} {{ type === 'os' ? '操作系统' : '浏览器' }}版本详情
      <a-button
        type="primary"
        class="!h-5 !text-xs !py-1 opacity-70 !leading-2 !px-2 float-right !mr-10"
        @click="() => addFilter(uaName)"
      >
        单击此处：筛选此{{ type === 'os' ? '操作系统' : '浏览器' }}
      </a-button>
    </div>
    <BasicChart :chartOption="uaVersionOption" :height="versionChartHeight" />
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getBrowserData, getOSData } from '@/apis/board/pv'
import { getUAOption, getUAVersionOption } from './uaInfoConfig'
import { useBoardStore } from '@/store/modules/board'
import { BaseChart, BasicChart } from '@vben/components'

const boardStore = useBoardStore()

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  boardType: {
    type: String,
    default: 'general',
  },
})

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  url: boardStore.filterState.url, //路由筛选
  browser: boardStore.filterState.browser, //浏览器筛选
  device: boardStore.filterState.device, //设备筛选
  province: boardStore.filterState.province, //地区筛选
  network: boardStore.filterState.network, //网络类型筛选
  client: boardStore.filterState.client, //客户端筛选
  os: boardStore.filterState.os, //操作系统筛选
  performance_key: boardStore.filterState.performance_key, //性能筛选
  performance_range: boardStore.filterState.performance_range, //性能筛选
}))

const uaName = ref('') //当前选中的ua名
const uaVersionList = ref({}) //选中ua名对应的版本列表

//从后端获取数据方法
const getUAData = async params => {
  //拦截请求结果，存入uaVersionList中
  const result = await (props.type === 'browser' ? getBrowserData(params) : getOSData(params))
  uaVersionList.value = result.data
  return result
}

//获取图例option
const getChartOption = data => getUAOption(data, uaName.value)

const uaVersionOption = ref({})
const versionChartHeight = ref('')

watch(uaName, val => {
  if (val.length) {
    const option = getUAVersionOption(uaVersionList.value, props.type, uaName.value)
    const dataLength = option.yAxis.data.length
    versionChartHeight.value = `${100 + dataLength * 60}px`
    uaVersionOption.value = option
  }
})

watch(requestParams, () => (uaName.value = ''))

const handleUAClick = params => {
  //若点击高亮块，取消版本信息显示
  if (params.name === uaName.value) {
    uaName.value = ''
  }
  //若点击新数据块，展示版本信息
  else {
    uaName.value = params.name
  }
}

const addFilter = uaName => {
  boardStore.addFilterValue({ [props.type]: uaName })
}
</script>
