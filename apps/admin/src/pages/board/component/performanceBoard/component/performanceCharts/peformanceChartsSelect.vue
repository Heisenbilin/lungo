<template>
  <div class="chart-container-full">
    <div class="chart-title">
      <a-select class="!mr-2" v-model:value="chartName">
        <template v-for="(value, key) in boardConfigs" :key="key">
          <a-select-option :value="key">{{ value.name }}</a-select-option>
        </template>
      </a-select>
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }" placement="right">
        <template #title>
          <span class="whitespace-pre-wrap ml-3">{{ boardConfigs[chartName].description }}</span>
        </template>
        <QuestionCircleOutlined />
      </a-tooltip>
      <a-tag color="blue" class="filter-tag"> 单击筛选：{{ chartName }}耗时、时间范围 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="getChartDataFuncs[boardConfigs[chartName].type - 1]"
      :getOptionFunc="getChartOptionFuncs[boardConfigs[chartName].type - 1]"
      :bindFuncs="{ click: addFilter }"
      :zrFuncs="{ click: addTimeFilter }"
    />
  </div>
</template>

<script setup>
import { nextTick, watch, ref } from 'vue';
import { useStore } from 'vuex';
import { litSquirrelApi } from '/@/api/littleSquirrel';
import { boardConfigs, getPerformanceChartOption } from './performanceChartsConfig';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { addTimeFilter } from '/@/components/boardNew/util/datePickerConfig';
import { boardStore } from '/@/store/modules/board';
import BaseChart from '/@/components/coreBoard/baseChart.vue';

// 请求参数
const store = useStore();
const { account: userid = '' } = store.state.userInfo;

const requestParams = ref({
  boardid: '0x000',
  filter: {
    gteTime: boardStore.getFilterState.start_time,
    lteTime: boardStore.getFilterState.end_time,
    boardType: 'dns',
  },
  projectid: `${boardStore.getBoardInfoState.id}`,
  userid,
});

const chartName = ref('dns');

watch(chartName, val => {
  if (boardConfigs[val].type === 1) {
    nextTick(() => {
      requestParams.value.filter.boardType = val;
      delete requestParams.value.estask_list;
    });
  } else {
    nextTick(() => {
      delete requestParams.value.filter.boardType;
      requestParams.value.estask_list = [boardConfigs[val].apiName];
    });
  }
});

// 数据清洗成图表option方法
const getChartOptionFuncs = [
  data => getPerformanceChartOption(data, boardStore.getTimeFormatStr, chartName.value),
  data => getPerformanceChartOption(data, boardStore.getTimeFormatStr),
];

// 获取数据api
const getChartDataFuncs = [
  litSquirrelApi.boardTaskInfo.getTimeSlotDataByType,
  litSquirrelApi.boardTaskInfo.getChartData,
];

const addFilter = title => {
  if (title.seriesType !== 'pie') return;
  const range = title.data.name.split(' to ');
  if (range.length === 2) {
    boardStore.addFilterValue({
      performance_key: chartName,
      performance_range: range.map(item => (item = parseInt(item))),
    });
  }
};
</script>
