<template>
  <BaseChart
    :requestParams="requestParams"
    :requestFunc="faultTolerantRequestFunc"
    :getOptionFunc="getFaultTolerantption"
    :bindFuncs="{ legendselectchanged: handleLegendChange }"
    :zrFuncs="{ click: addTimeFilter }"
  />
</template>

<script setup>
//容错统计图表
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { getFaultTolerantChartOption } from './faultTolerantChartConfig';
import { addTimeFilter } from '/@/components/boardNew/util/datePickerConfig';
import { ResourceApis } from '/@/api/board/resource';
import { litSquirrelApi } from '/@/api/littleSquirrel';
import { boardStore } from '/@/store/modules/board';
import BaseChart from '/@/components/coreBoard/baseChart.vue';

const store = useStore();

const { account: userid = '' } = store.state.userInfo;
const requestParams = computed(() => ({
  boardid: '0x000',
  filter: {
    gteTime: boardStore.getFilterState.start_time,
    lteTime: boardStore.getFilterState.end_time,
  },
  projectid: `${boardStore.getBoardInfoState.id}`,
  userid,
  estask_list: ['resource_success_num', 'resource_num', 'pv'],
}));

const selectedLegend = ref({
  selected: { 异常率: true, 接入容错前异常率: false, 容错失败率: false },
});

//监听筛选项的变化
const handleLegendChange = params => {
  selectedLegend.value = params;
};

const faultTolerantRequestFunc = litSquirrelApi.boardTaskInfo.getChartData;
const getFaultTolerantption = data =>
  getFaultTolerantChartOption(data, boardStore.getTimeFormatStr, selectedLegend.value);
</script>
