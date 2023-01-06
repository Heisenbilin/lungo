<template>
  <div class="flex h-20 flex-row justify-center chart-container-full">
    <a-spin size="large" class="flex self-center" v-if="loading" />
    <template v-else>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">总异常数</div>
        <div class="text-3xl font-medium">{{ commafy(summaryData.summaryCount) }}</div>
      </div>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">总PV数</div>
        <div class="text-3xl font-medium">{{ commafy(summaryData.pvTotal) }}</div>
      </div>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="计算规则：总异常数/总PV数">
            总异常率 <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">
            {{ summaryData.errorRate }}
          </div>
          <div class="text-gray-500">%</div>
        </div>
      </div>
      <div class="w-1/5 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">异常类型</div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(summaryData.errorType) }}</div>
        </div>
      </div>
    </template>
  </div>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <template #tabBarExtraContent>
        <a-tag color="blue" class="!mt-2 filter-tag"> 单击筛选：时间范围</a-tag>
      </template>
      <a-tab-pane key="1" tab="异常量与异常率">
        <BaseChart
          :requestParams="requestParams"
          :requestFunc="requestSummaryData"
          :getOptionFunc="getSummaryOption"
          :zrFuncs="{ click: addTimeFilter }"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
//runtime异常数据汇总组件
import { ref, computed } from "vue";
import { useBoardStore } from "@/store/modules/board";
import { getSummaryChartOption } from "../../../util/errorSummaryChartConfig";
import { commafy } from "@vben/utils";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import { getSummaryData } from "@/apis/board/runtime";
import { addTimeFilter } from "../../../util/datePickerConfig";
import { BaseChart } from "@vben/components";

const boardStore = useBoardStore();

const loading = ref(true);
const activeKey = ref("1");

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  dimension: boardStore.filterState.dimension, //维度
  url: boardStore.filterState.url, //路由筛选
  browser: boardStore.filterState.browser, //浏览器筛选
  device: boardStore.filterState.device, //设备筛选
  region: boardStore.filterState.region, //地区筛选
  network: boardStore.filterState.network, //网络类型筛选
  client: boardStore.filterState.client, //客户端筛选
  os: boardStore.filterState.os, //操作系统筛选
}));

const summaryData = ref({
  summaryCount: "",
  errorType: "",
  errorRate: "",
  pvTotal: "",
});

const getSummaryOption = (data) => getSummaryChartOption(data, boardStore.getTimeFormatStr);

//从后端获取均值瀑布图数据方法
const requestSummaryData = async (params) => {
  loading.value = true;
  //拦截请求结果，存入summaryData中
  const result = await getSummaryData(params);
  const data = result.data;
  const percent = ((data.errorTotal / data.pvTotal) * 100).toFixed(2);
  summaryData.value = Object.keys(data).length
    ? {
        summaryCount: data.errorTotal,
        errorType: data.errorType,
        pvTotal: data.pvTotal,
        errorRate: isNaN(+percent) || percent === "Infinity" ? "0" : percent,
      }
    : { summaryCount: "", errorType: "", errorRate: "", pvTotal: "" };
  loading.value = false;
  result.data = data?.list ?? [];
  return result;
};
</script>
