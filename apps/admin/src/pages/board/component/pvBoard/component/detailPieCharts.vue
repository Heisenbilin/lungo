<template>
  <div class="chart-container">
    <div class="chart-title">
      网络类型
      <a-tag color="blue" class="filter-tag"> 单击筛选：网络 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="PVApis.getNetworkData"
      :getOptionFunc="getNetworkTypeOption"
      :bindFuncs="{ click: title => addFilter(title, 'network') }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">
      客户端类型 <a-tag color="blue" class="filter-tag"> 单击筛选：客户端 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="PVApis.getClientData"
      :getOptionFunc="getClientTypeOption"
      :bindFuncs="{ click: title => addFilter(title, 'client') }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">
      设备类型 <a-tag color="blue" class="filter-tag"> 单击筛选：设备 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="PVApis.getDeviceData"
      :getOptionFunc="getDeviceTypeOption"
      :bindFuncs="{ click: title => addFilter(title, 'device') }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { PVApis } from '/@/api/board/pv';
import {
  getNetworkTypeOption,
  getClientTypeOption,
  getDeviceTypeOption,
  clientUserAgent,
} from '../../util/pieChartConfig';
import { boardStore } from '/@/store/modules/board';
import BaseChart from '/@/components/coreBoard/baseChart.vue';

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

const addFilter = (title, key) => {
  const name =
    key === 'client'
      ? `${
          Object.keys(clientUserAgent).find(key => clientUserAgent[key] === title.data.name) ??
          '未知'
        }`
      : title.data.name;
  boardStore.addFilterValue({ [key]: name });
};
</script>
