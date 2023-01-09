<template>
  <BaseChart
    :requestParams="requestParams"
    :requestFunc="getChartData"
    :getOptionFunc="getFaultTolerantption"
    :bindFuncs="{ legendselectchanged: handleLegendChange }"
    :zrFuncs="{ click: addTimeFilter }"
  />
</template>

<script setup lang="ts">
//容错统计图表
import { computed, ref } from "vue";
// import { useStore } from "vuex";
import { getFaultTolerantChartOption } from "./faultTolerantChartConfig";
import { addTimeFilter } from "../../../util/datePickerConfig";
// import { ResourceApis } from "@/apis/board/resource";
import { getChartData } from "@/apis/board/sourceMap";
import { useBoardStore } from "@/store/modules/board";
import { BaseChart } from "@vben/components";

const boardStore = useBoardStore();

// const store = useStore();

// const { account: userid = "" } = store.state.userInfo;
const userid = "xiongbilin";

const requestParams = computed(() => ({
  boardid: "0x000",
  filter: {
    gteTime: boardStore.filterState.start_time,
    lteTime: boardStore.filterState.end_time,
  },
  projectid: `${boardStore.boardInfoState.id}`,
  userid,
  estask_list: ["resource_success_num", "resource_num", "pv"],
}));

const selectedLegend = ref({
  selected: { 异常率: true, 接入容错前异常率: false, 容错失败率: false },
});

//监听筛选项的变化
const handleLegendChange = (params) => {
  selectedLegend.value = params;
};

const getFaultTolerantption = (data) =>
  getFaultTolerantChartOption(data, boardStore.getTimeFormatStr, selectedLegend.value);
</script>
