<template>
  <div class="flex h-20 flex-row justify-center chart-container-full">
    <a-spin size="large" class="flex self-center" v-if="loading" />
    <template v-else>
      <div class="w-1/7 grid justify-items-center content-center space-y-1">
        <a-tooltip :overlayStyle="{ maxWidth: '500px' }" title="加载异常、且未容错/容错失败的资源的总和">
          <div class="text-gray-500">失败资源数
            <QuestionCircleOutlined />
          </div>
        </a-tooltip>
        <div class="text-3xl font-medium">{{ commafy(summaryData.errTotal) }}</div>
      </div>
      <div class="w-1/7 grid justify-items-center content-center space-y-1" v-if="faultTolerantStatus === 'accessed'">
        <a-tooltip :overlayStyle="{ maxWidth: '500px' }" title="经过资源容错过程后，成功容错的资源数量总和。">
          <div class="text-gray-500">容错成功资源数
            <QuestionCircleOutlined />
          </div>
        </a-tooltip>
        <div class="text-3xl font-medium">{{ commafy(summaryData.successCount) }}</div>
      </div>
      <div class="w-1/7 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">影响用户数</div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(summaryData.userCount) }}</div>
        </div>
      </div>
      <div class="w-1/7 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">总PV数</div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(summaryData.pvTotal) }}</div>
        </div>
      </div>
      <div class="w-1/7 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="计算规则：总异常数/总PV数">
            总异常率
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">
            {{ summaryData.errorRate }}
          </div>
          <div class="text-gray-500">%</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
//resource异常数据汇总组件
import { ref, computed, watch } from 'vue'
import { getSummaryData } from '@/apis/board/resource'
import { commafy } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useAppTheme } from '@vben/hooks';
const { isDark } = useAppTheme()
defineProps({
  faultTolerantStatus: {
    type: String,
    required: true,
  },
})

const boardStore = useBoardStore()
//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  dimension: boardStore.filterState.dimension, //维度
  url: boardStore.filterState.url, //路由筛选
  browser: boardStore.filterState.browser, //浏览器筛选
  device: boardStore.filterState.device, //设备筛选
  province: boardStore.filterState.province, //地区筛选
  network: boardStore.filterState.network, //网络类型筛选
  client: boardStore.filterState.client, //客户端筛选
  os: boardStore.filterState.os, //操作系统筛选
  resource_type: boardStore.filterState.resource_type, //资源类型筛选
}))

const loading = ref(true)

const summaryData = ref({
  errTotal: '',
  errorRate: '',
  userCount: '',
  pvTotal: '',
  successCount: '',
})

const requestSummaryData = async params => {
  loading.value = true
  //拦截请求结果，存入summaryData中
  try {
    const result = await getSummaryData(params)
    summaryData.value = result.data
  } catch (err) {
    summaryData.value = {
      errTotal: '',
      errorRate: '',
      userCount: '',
      pvTotal: '',
      successCount: '',
    }
  } finally {
    loading.value = false
  }
}
watch(
  () => requestParams,
  () => requestSummaryData(requestParams.value),
  {
    deep: true,
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
:deep(.ant-tag) {
  height: 22px;
  font-size: 14px;
}
</style>
