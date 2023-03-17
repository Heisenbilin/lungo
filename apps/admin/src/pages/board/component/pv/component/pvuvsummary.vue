<template>
  <div class="chart-container-full flex h-20 flex-row justify-center">
    <a-spin size="large" class="flex self-center" v-if="loading" />
    <template v-else>
      <div class="w-1/4 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
            <template #title>
              PV(page view):页面浏览量或点击量。用来衡量网站的访问次数。<br />
              PV采集规则：一条 data.type 为 'pv' 的日志采集一次 PV 行为。<br />
              hashchange 事件也可进行 PV 采集，配置请参考
              <a
                href="https://app.xesv5.com/doc/pages/fedata/fe-log-sdk/access.html#npm%E6%8E%A5%E5%85%A5%E3%80%90%E6%8E%A8%E8%8D%90%E3%80%91"
              >
                SDK 配置详情 </a
              ><br />
              SDK 2.3.4 版本以下无数据，请确保您的 SDK 版本在 2.3.4 以上。
            </template>
            总PV数
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="text-3xl font-medium">{{ commafy(totalCount.PVCount) }}</div>
      </div>
      <div class="w-1/4 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
            <template #title>
              UV(unique visitor):独立访客数。用来统计一天内访问某站点的用户数。<br />
              UV量统计规则：一天内独立的 data.uvid 为一次 UV 行为。<br />
              uvid 可自行配置，配置请参考
              <a
                href="https://app.xesv5.com/doc/pages/fedata/fe-log-sdk/access.html#npm%E6%8E%A5%E5%85%A5%E3%80%90%E6%8E%A8%E8%8D%90%E3%80%91"
              >
                SDK 配置详情 </a
              ><br />
              SDK 2.3.4 版本以下无数据，请确保您的 SDK 版本在 2.3.4 以上。
            </template>
            总UV数
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="text-3xl font-medium">{{ commafy(totalCount.UVCount) }}</div>
      </div>
    </template>
  </div>
  <div class="chart-container-full">
    <div class="chart-title">
      页面访问 <a-tag color="blue" class="filter-tag"> 单击筛选：时间范围 </a-tag>
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
        <template #title>
          PV(page view):页面浏览量或点击量。用来衡量网站的访问次数。<br />
          UV(unique visitor):独立访客数。用来统计1天内访问某站点的用户数。
        </template>
        <QuestionCircleOutlined />
      </a-tooltip>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="requestPageViewData"
      :getOptionFunc="getChartOption"
      :zrFuncs="{ click: addTimeFilter }"
    />
  </div>
</template>

<script setup lang="ts">
// pv与uv图表
import { computed, reactive, ref } from 'vue'
import { getPVUVChartOption } from './chartsConfig'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { getSummaryData, getPageViewData } from '@/apis/board/pv'
import { useBoardStore } from '@/store/modules/board'
import { commafy } from '@vben/utils'
import { addTimeFilter } from '@/hooks/board/useDate'
import { BaseChart } from '@vben/components'
const boardStore = useBoardStore()

const loading = ref(true)
const totalCount = reactive({ PVCount: '', UVCount: '' })

const requestPageViewData = async params => {
  loading.value = true
  getSummaryData(params)
    .then(res => {
      totalCount.UVCount = res?.data[0]?.uv || ''
      totalCount.PVCount = res?.data[0]?.pv || ''
    })
    .catch(() => {
      totalCount.UVCount = ''
      totalCount.PVCount = ''
      return null
    })
    .finally(() => {
      loading.value = false
    })
  return getPageViewData(params)
}

// 请求参数
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
  performance_key: boardStore.filterState.performance_key, //性能筛选
  performance_range: boardStore.filterState.performance_range, //性能筛选
}))

// 获取图表option(PV、UV图表共用)
const getChartOption = data => getPVUVChartOption(data, boardStore.getTimeFormatStr)
</script>
