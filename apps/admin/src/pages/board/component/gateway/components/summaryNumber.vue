<template>
  <div class="flex h-20 flex-row justify-center chart-container-full"
    :style="{ 'background-color': isDark ? 'rgb(20,20,20)' : '' }">
    <a-spin size="large" class="flex self-center" v-if="loading" />
    <template v-else>
      <div class="w-1/4 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">请求总数</div>
        <div class="text-3xl font-medium">{{ commafy(summaryData.summaryCount) }}</div>
      </div>
      <div class="w-1/4 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip :overlayStyle="{ maxWidth: '400px' }">
            <template #title>
              计算规则：请求成功数/请求总数<br />
              成功请求：请求响应码在200-300区间或响应码为304
            </template>
            成功率
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">
            {{ summaryData.successRate }}
          </div>
          <div class="text-gray-500">%</div>
        </div>
      </div>
      <div class="w-1/4 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">平均耗时</div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(summaryData.averageTime) }}</div>
          <div class="text-gray-500">ms</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
//网关监控数据汇总组件
import { ref, watch } from "vue";
import { getSummary } from "@/apis/board/gateway";
import { commafy } from "@vben/utils";
import { useBoardStore } from "@/store/modules/board";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import { useAppTheme } from '@vben/hooks';
const { isDark } = useAppTheme()

const boardStore = useBoardStore();

const loading = ref(true);
const summaryData = ref({ summaryCount: "", successRate: "", averageTime: "" });

const getSummaryData = async (params) => {
  loading.value = true;
  const result = await getSummary(params);
  summaryData.value = result?.data ?? { summaryCount: "", successRate: "", averageTime: "" };
  loading.value = false;
};

watch(
  () => ({
    project_id: boardStore.boardInfoState.id,
    start_time: boardStore.filterState.start_time,
    end_time: boardStore.filterState.end_time,
  }),
  (params) => getSummaryData(params),
  { immediate: true }
);
</script>
