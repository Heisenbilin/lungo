<template>
  <div class="flex h-20 flex-row justify-center chart-container-full">
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
            成功率 <QuestionCircleOutlined />
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

<script setup>
//api异常数据汇总组件

import { ref, watch, computed } from 'vue';
import { ApiErrorApis } from '/@/api/board/apiError';
import { commafy } from '/@/utils/math/formatMumber';
import { boardStore } from '/@/store/modules/board';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

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

const loading = ref(true);
const summaryData = ref({ summaryCount: '', successRate: '', averageTime: '' });

const getSummaryData = async () => {
  loading.value = true;
  const result = await ApiErrorApis.getSummaryData(requestParams.value);
  summaryData.value = result?.data ?? {
    summaryCount: '',
    successRate: '',
    averageTime: '',
  };
  loading.value = false;
};

watch(requestParams, getSummaryData, { immediate: true });
</script>
