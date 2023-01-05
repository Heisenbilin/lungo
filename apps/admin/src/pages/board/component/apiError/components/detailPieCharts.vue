<template>
  <div class="chart-container">
    <div class="chart-title">
      响应码
      <a-tag color="blue" class="filter-tag"> 单击设置筛选 </a-tag>
      <a-tag color="green" class="float-right"> 双击查看日志 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="ApiErrorApis.getStatusData"
      :getOptionFunc="getStatusChartOption"
      :bindFuncs="{ click: title => addFilter(title, 'api_status'), dblclick: openStatusLog }"
    />
  </div>
  <div class="chart-container">
    <div class="chart-title">
      耗时统计
      <a-tag color="blue" class="filter-tag"> 单击设置筛选 </a-tag>
      <a-tag color="green" class="float-right"> 双击查看日志 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="ApiErrorApis.getCostTimeData"
      :getOptionFunc="getCostTimeChartOption"
      :bindFuncs="{ click: title => addFilter(title, 'api_range'), dblclick: openCostTimeLog }"
    />
  </div>
</template>

<script setup>
//api异常详情相关饼图组件
import { computed } from 'vue';
import { ApiErrorApis } from '/@/api/board/apiError';
import { boardStore } from '/@/store/modules/board';
import { getStatusChartOption, getCostTimeChartOption } from '../../util/pieChartConfig';
import { logTypeEnum } from '/@/enums/boardEnum';
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
  api_status: boardStore.getFilterState.api_status, //api状态码筛选
  api_range: boardStore.getFilterState.api_range, //api耗时筛选
}));

var intervalTimer = null; //定时器

//打开日志详情
const openStatusLog = title => {
  clearTimeout(intervalTimer); //取消上次延时未执行的方法
  if (title.data.name === '未知') {
    title.data.name = 'unknown';
  }
  boardStore.openLogInfoState({
    type: logTypeEnum.API,
    visible: true,
    requestParams: {
      response_status: title.data.name,
    },
  });
};

const openCostTimeLog = title => {
  clearTimeout(intervalTimer); //取消上次延时未执行的方法
  const [from, to] = title.data.name.split(' to ');
  boardStore.openLogInfoState({
    type: logTypeEnum.API,
    visible: true,
    requestParams: {
      range_start: from,
      range_end: to,
    },
  });
};

const addFilter = (title, key) => {
  clearTimeout(intervalTimer); //取消上次延时未执行的方法
  intervalTimer = setTimeout(() => {
    let value = title.data.name;
    if (key === 'api_range') {
      value = value.split(' to ');
      if (value.length === 2) {
        boardStore.addFilterValue({ [key]: value.map(item => (item = parseInt(item))) });
      }
    }
    boardStore.addFilterValue({ [key]: value });
  }, 300);
};
</script>
