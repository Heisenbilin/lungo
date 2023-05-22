<template>
  <div class="flex h-20 flex-row justify-center chart-container-full">
    <a-spin size="large" class="flex self-center" v-if="loading" />
    <template v-else>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="成功进行性能采样的PV数，一般少于页面访问的PV数">
            采样PV数
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(averageData.count || '') }}</div>
        </div>
      </div>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="均值">
            首字节
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(averageData.firstbyte || '') }}</div>
          <div class="text-gray-500">ms</div>
        </div>
      </div>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="均值">
            DOM Ready
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(averageData.ready || '') }}</div>
          <div class="text-gray-500">ms</div>
        </div>
      </div>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip title="均值">
            页面完全加载
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium">{{ commafy(averageData.load || '') }}</div>
          <div class="text-gray-500">ms</div>
        </div>
      </div>
      <div class="w-1/6 grid justify-items-center content-center space-y-1">
        <div class="text-gray-500">
          <a-tooltip :overlayStyle="{ maxWidth: '400px' }">
            <template #title>
              根据页面完全加载时间计算产生 <br />
              0S-2.5S：100-75分<br />
              2.5S-4S：75-50分<br />
              4S-20S：50-0分<br />
              20S以上：0分
            </template>
            得分
            <QuestionCircleOutlined />
          </a-tooltip>
        </div>
        <div class="flex items-end">
          <div class="text-3xl font-medium" :style="{ color: barFinColor(averageData.score) }">
            {{ averageData.score }}
          </div>
          <div class="text-gray-500">分</div>
        </div>
      </div>
    </template>
  </div>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <template #rightExtra>
        <span class="mr-3 pt-2" v-if="activeKey === 'percentile'">
          <a-select style="width: 130px" v-model:value="label" size="small" :options="lableList" />
        </span>

        <a-tag color="blue" class="filter-tag"> 单击筛选：时间范围</a-tag>
      </template>
      <a-tab-pane key="average" tab="性能均值">
        <BaseChart
          v-if="activeKey === 'average'"
          :requestParams="requestParams2"
          :requestFunc="getChartSummaryData"
          :getOptionFunc="getSummaryOption"
          :zrFuncs="{ click: addTimeFilter }"
        />
      </a-tab-pane>
      <a-tab-pane key="contrast">
        <template #tab>
          快/慢开比
          <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
            <template #title>
              快开比: 页面完全加载时长 ≤ 某时长(如2s)的 采样PV / 总采样PV * 100% <br />
              慢开比: 页面完全加载时长 ≥ 某时长(如5s)的 采样PV / 总采样PV * 100%
            </template>
            <QuestionCircleOutlined class="ml-2" />
          </a-tooltip>
        </template>
        <BaseChart
          v-if="activeKey === 'contrast'"
          :requestParams="requestParams2"
          :requestFunc="getContrastData"
          :getOptionFunc="getContrastChartOption"
          :zrFuncs="{ click: addTimeFilter }"
        />
      </a-tab-pane>
      <a-tab-pane key="percentile">
        <template #tab>
          性能百分位
          <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
            <template #title>
              各个性能指标的百分位数。<br />
              例如：50%的页面页面完全加载时间的加载时间 ≤ 2.5s
            </template>
            <QuestionCircleOutlined class="ml-2" />
          </a-tooltip>
        </template>
        <BaseChart
          v-if="activeKey === 'percentile'"
          :requestParams="requestParams3"
          :requestFunc="getPercentileData"
          :getOptionFunc="getPercentileChartOption"
          :zrFuncs="{ click: addTimeFilter }"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey2" class="box-border w-full">
      <a-tab-pane key="waterfall" tab="页面加载均值瀑布图">
        <BaseChart
          :requestParams="requestParams"
          :requestFunc="requestAverageData"
          :getOptionFunc="useDataToWaterfallChartOption"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataToWaterfallChartOption } from '@vben/hooks'
import {
  getSummaryChartOption,
  getContrastChartOption,
  getPercentileChartOption,
} from './chartConfig'
import {
  getChartSummaryData,
  getAverageData,
  getContrastData,
  getPercentileData,
} from '@/apis/board/performance'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { commafy, barFinColor } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { BaseChart } from '@vben/components'
import { addTimeFilter } from '@/hooks/board/useDate'

const boardStore = useBoardStore()

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
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

const requestParams2 = computed(() => ({
  ...requestParams.value,
  dimension: boardStore.filterState.dimension, //维度
}))

const activeKey = ref('average')
const activeKey2 = ref('waterfall')
const label = ref('load')

const lableList = [
  { label: '页面完全加载', value: 'load' },
  { label: '首字节', value: 'firstbyte' },
  { label: 'DOM Ready', value: 'ready' },
  { label: 'DOM 解析', value: 'dom' },
  { label: 'DNS 查询', value: 'dns' },
  { label: 'TCP 连接', value: 'tcp' },
  { label: 'SSL 建连', value: 'ssl' },
  { label: '请求响应', value: 'ttfb' },
  { label: 'downlink', value: 'downlink' },
  { label: '首次绘制', value: 'fp' },
  { label: '首次内容绘制', value: 'fcp' },
  { label: '资源加载', value: 'res' },
  { label: 'trans', value: 'trans' },
  { label: '首次可交互时间', value: 'tti' },
]

const requestParams3 = computed(() => ({
  ...requestParams2.value,
  percent_type: label.value,
  percents: [50, 70, 85, 95, 98],
}))

const loading = ref(true)
const averageData = ref({
  firstbyte: '',
  dom: '',
  load: '',
  ready: '',
  score: '',
  count: '',
})

//从后端获取均值瀑布图数据方法
const getSummaryOption = data => getSummaryChartOption(data)

//从后端获取均值瀑布图数据方法
const requestAverageData = async params => {
  loading.value = true
  //拦截请求结果，存入averageData中
  const result = await getAverageData(params)
  averageData.value = result?.data ?? {
    firstbyte: '',
    dom: '',
    load: '',
    ready: '',
    score: '',
    count: '',
  }
  loading.value = false
  return result
}
</script>
