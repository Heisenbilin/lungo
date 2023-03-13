<template>
  <div class="mt-4 grid grid-cols-2 gap-3">
    <div class="chart-container">
      <div class="chart-title">
        PV
        <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
          <template #title>
            即 page view，页面浏览量或点击量。<br />用来衡量网站用户访问的网页数量。
          </template>
          <QuestionCircleOutlined />
        </a-tooltip>
      </div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getPVChartData"
        :getOptionFunc="getChartOption"
      />
    </div>
    <div class="chart-container">
      <div class="chart-title">
        UV
        <a-tooltip :overlayStyle="{ maxWidth: '500px' }">
          <template #title>
            即 unique visitor，独立访客数。<br />用来统计1天内访问某站点的用户数。
          </template>
          <QuestionCircleOutlined />
        </a-tooltip>
      </div>
      <BaseChart
        :requestParams="requestParams"
        :requestFunc="getUVChartData"
        :getOptionFunc="getChartOption"
      />
    </div>
    <div class="chart-container">
      <div class="chart-title">浏览器信息</div>
      <uaInfo type="browser" boardType="data" />
    </div>
    <div class="chart-container">
      <div class="chart-title">设备信息</div>
      <uaInfo type="os" boardType="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
//通用看板组件
import { computed } from 'vue'
import { getPVUVChartOption } from './chartsConfig'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { getChartData } from '@/apis/board/sourceMap'
import { usePanelStore } from '@/store/modules/panel'
import { useUserStore } from '@/store/user'
import { BaseChart } from '@vben/components'
import uaInfo from '@/pages/report/total/components/uaInfo.vue'


const panelStore = usePanelStore()
const userStore = useUserStore()
const userName = userStore.userInfo?.account || ''

// 请求参数
const requestParams = computed(() => ({
  boardid: '0x000',
  filter: {
    gteTime: panelStore.filterState.start_time,
    lteTime: panelStore.filterState.end_time,
  },
  projectid: `${panelStore.boardInfoState.id}`,
  userid: userName,
}))

// 获取PV图标数据
const getPVChartData = params => {
  params.estask_list = ['pv']
  return getChartData(params)
}

// 获取UV图表数据
const getUVChartData = params => {
  params.estask_list = ['uv']
  return getChartData(params)
}

// 获取图表option(PV、UV图表共用)
const getChartOption = data => getPVUVChartOption(data, panelStore.getTimeFormatStr)
</script>
