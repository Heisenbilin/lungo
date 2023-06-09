<template>
  <div class="grid grid-cols-2 gap-3">
    <div class="chart-container-full text-center" v-if="!isSafeSDK">
      <a
        href="https://npm.100tal.com/~/package/@xes/xes_fe_log"
        target="_blank"
        class="text-red-500"
      >
        SDK版本更新公告：
        日志上报SDK版本低于2.4.0的应用，页面访问数据采集不完整，请及时升级至2.4.0及以上版本【点击查看】。
      </a>
    </div>
    <PVUVSummary />
    <UrlTable />
    <UACharts modelType="pv" :mustShow="true" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { versionStringCompare } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import PVUVSummary from './component/pvuvsummary.vue'
import UACharts from '@/pages/component/uaCharts.vue'
import UrlTable from './component/urlTable/urlTable.vue'

const boardStore = useBoardStore()

const isSafeSDK = computed<boolean>(() =>
  Boolean(
    !boardStore.latestSDKVersionState ||
      versionStringCompare(boardStore.boardInfoState.sdk_version, '2.4.0') !== -1,
  ),
)
</script>
