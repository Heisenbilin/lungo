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
        @click="addFilter(uaName)"
      >
        单击此处：筛选此{{ type === 'os' ? '操作系统' : '浏览器' }}
      </a-button>
    </div>
    <BasicChart :chartOption="uaVersionOption" :height="versionChartHeight" />
  </template>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { PVApis } from '/@/api/board/pv';
import { getUAOption, getUAVersionOption } from './uaInfoConfig';
import { boardStore } from '/@/store/modules/board';
import BaseChart from '/@/components/coreBoard/baseChart.vue';
import BasicChart from '/@/components/coreBoard/charts/basicChart.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  boardType: {
    type: String,
    default: 'general',
  },
});

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.getBoardInfoState.id}`, //项目id
  start_time: boardStore.getFilterState.start_time, //开始时间
  end_time: boardStore.getFilterState.end_time, //结束时间
  url: boardStore.getFilterState.url, //路由筛选
  browser: boardStore.getFilterState.browser, //浏览器筛选
  device: boardStore.getFilterState.device, //设备筛选
  region: boardStore.getFilterState.region, //地区筛选
  network: boardStore.getFilterState.network, //网络类型筛选
  client: boardStore.getFilterState.client, //客户端筛选
  os: boardStore.getFilterState.os, //操作系统筛选
  performance_key: boardStore.getFilterState.performance_key, //性能筛选
  performance_range: boardStore.getFilterState.performance_range, //性能筛选
}));

const uaName = ref(''); //当前选中的ua名
const uaVersionList = ref({}); //选中ua名对应的版本列表

//从后端获取数据方法
const getUAData = async params => {
  //拦截请求结果，存入uaVersionList中
  const result = await (props.type === 'browser'
    ? PVApis.getBrowserData(params)
    : PVApis.getOSData(params));
  uaVersionList.value = result.data;
  return result;
};

//获取图例option
const getChartOption = data => getUAOption(data, uaName.value);

const uaVersionOption = ref({});
const versionChartHeight = ref('');

watch(uaName, val => {
  if (val.length) {
    const option = getUAVersionOption(uaVersionList.value, props.type, uaName.value);
    const dataLength = option.yAxis.data.length;
    versionChartHeight.value = `${100 + dataLength * 60}px`;
    uaVersionOption.value = option;
  }
});

watch(requestParams, () => (uaName.value = ''));

const handleUAClick = params => {
  //若点击高亮块，取消版本信息显示
  if (params.name === uaName.value) {
    uaName.value = '';
  }
  //若点击新数据块，展示版本信息
  else {
    uaName.value = params.name;
  }
};

const addFilter = uaName => {
  boardStore.addFilterValue({ [props.type]: uaName });
};
</script>
