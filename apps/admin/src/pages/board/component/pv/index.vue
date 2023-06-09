<template>
  <div class="grid grid-cols-2 gap-3">
    <div class="chart-container-full text-center" v-if="!isSafeSDK">
      <a
        href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log"
        target="_blank"
        class="text-red-500"
      >
        SDK版本更新公告：
        日志上报SDK版本低于2.4.0的应用，页面访问数据采集不完整，请及时升级至2.4.0及以上版本【点击查看】。
      </a>
    </div>
    <PVUVSummary />
    <UrlTable />
    <div class="chart-container">
      <div class="chart-title">浏览器类型</div>
      <uaInfo type="browser" />
    </div>
    <div class="chart-container">
      <div class="chart-title">操作系统类型</div>
      <uaInfo type="os" />
    </div>
    <UAMap />
    <DetailPieCharts />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { versionStringCompare } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
//通用看板组件
import PVUVSummary from './component/pvuvsummary.vue'
import uaInfo from './component/uaInfo/index.vue'
import UrlTable from './component/urlTable/urlTable.vue'
import UAMap from './component/uaMap.vue'
import DetailPieCharts from './component/detailPieCharts.vue'

const boardStore = useBoardStore()

const isSafeSDK = computed<boolean>(() =>
  Boolean(
    !boardStore.latestSDKVersionState ||
      versionStringCompare(boardStore.boardInfoState.sdk_version, '2.4.0') !== -1,
  ),
)
</script>
