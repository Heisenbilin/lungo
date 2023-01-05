<template>
  <div class="chart-container-full">
    <div class="chart-title">
      异常Top10 <a-tag color="green" class="filter-tag"> 双击查看日志 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :bindFuncs="{ dblclick: openLog }"
      :requestFunc="RuntimeApis.getTop10Data"
      :getOptionFunc="getChartOption"
    />
  </div>
</template>

<script setup>
// 运行时异常详情相关饼图组件
import { computed } from 'vue';
import { getTop10Option } from '../../util/pieChartConfig';
import { boardStore } from '/@/store/modules/board';
import { logTypeEnum } from '/@/enums/boardEnum';
import { RuntimeApis } from '/@/api/board/runtime';
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
}));

// 计算图表option
const getChartOption = data => getTop10Option(data, 60);

//打开日志详情
const openLog = title => {
  boardStore.openLogInfoState({
    type: logTypeEnum.RUNTIME,
    visible: true,
    requestParams: {
      error_content: title.data.name,
      error_type: 'content',
    },
  });
};
</script>
