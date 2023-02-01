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
      {{ uaName }} {{ type === 'os' ? '设备' : '浏览器' }}版本详情
    </div>
    <BasicChart :chartOption="uaVersionOption" :height="versionChartHeight" />
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getUaChartData } from '@/apis/report'
import { getUAOption, getUAVersionOption } from './uaInfoConfig'
import { useBoardDataStore } from '@/store/modules/panel'
import { useReportStore } from '@/store/modules/report'
import { BaseChart } from '@vben/components'
import { BasicChart } from '@vben/components'

const reportStore = useReportStore()
const boardDataStore = useBoardDataStore()

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

const storeBoard = props.boardType === 'data' ? boardDataStore : reportStore

// const store = useStore();
// const { account: userid = '' } = store.state.userInfo;
const userid = 'xiongbilin'

// 请求参数
const requestParams = computed(() => ({
  boardid: '0x000',
  filter: {
    gteTime: storeBoard.filterState.start_time,
    lteTime: storeBoard.filterState.end_time,
    uaType: 'ua_' + props.type + '_name',
  },
  projectid: `${storeBoard.boardInfoState.id}`,
  userid,
}))

const uaName = ref('') //当前选中的ua名
const uaVersionList = ref({}) //选中ua名对应的版本列表

//从后端获取数据方法
const getUAData = async params => {
  //拦截请求结果，存入uaVersionList中
  const result = await getUaChartData(params)
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
</script>
