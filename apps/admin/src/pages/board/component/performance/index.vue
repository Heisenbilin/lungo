<template>
  <div class="grid grid-cols-2 gap-3">
    <Summary />
    <UrlTable />
    <template v-if="successList.length">
      <performanceList
        :successList="successList"
        :projectId="projectId"
        :startTime="startTime"
        :endTime="endTime"
        :type="props.platformType"
      />
    </template>
    <PerformanceChartsSelect />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import moment from "moment";
import { formatDate } from "@/hooks/board/date";
import Summary from "./component/summary/index.vue";
import UrlTable from "./component/urlTable/urlTable.vue";
import PerformanceChartsSelect from "./component/performanceCharts/peformanceChartsSelect.vue";
import performanceList from "./component/performanceAdvise/performanceList.vue";
import { useBoardStore } from "@/store/modules/board";
import { useReportStore } from "@/store/modules/report";
import { getListById } from "@/components/boardReport/apis";

const boardStore = useBoardStore();
const reportStore = useReportStore();

const props = defineProps({
  platformType: {
    type: String,
  },
  // boardType: {
  //   type: String,
  //   default: 'general',
  // },
});

const projectId = computed(() => `${boardStore.boardInfoState.id}`);
// 初始化周报请求时间
const start_time = formatDate(
  moment()
    .subtract(new Date().getDay() + 6, "days")
    .valueOf(),
  "YY-MM-DD"
);
const end_time = formatDate(
  moment()
    .subtract(new Date().getDay() - 1, "days")
    .valueOf(),
  "YY-MM-DD"
);
const startTime = computed(() => reportStore.filterState.start_time || start_time);
const endTime = computed(() => reportStore.filterState.end_time || end_time);

//后台数据获取与处理
const successList = ref([]);
const getUrlByPro = async (page = 1, limit = 100000) => {
  let params = {
    project_id: projectId.value,
    start_time: startTime.value,
    end_time: endTime.value,
    page,
    limit,
  };
  const { data } = await getListById(params);
  successList.value = data?.projectList.filter((item) => item.lighthouse_status === "success");
};
watch(
  () => projectId,
  () => getUrlByPro(),
  { immediate: true, deep: true }
);
</script>
