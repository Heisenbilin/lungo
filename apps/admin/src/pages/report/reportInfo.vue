<template>
  <div class="p-4 bg-color mb-8">
    <div class="grid grid-cols-2 gap-3">
      <div class="chart-container">
        <InfoCard boardType="report" />
      </div>
      <div v-if="boardInfoState.id" class="chart-container">
        <ReportFilterCard />
      </div>
    </div>

    <div
      class="chart-container-full text-center mt-3 dark:bg-[var(--component-background-color)]"
      v-if="!isSafeSDK"
    >
      <a
        href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log"
        target="_blank"
        class="text-red-500"
      >
        SDK版本更新公告：
        日志上报SDK版本低于2.4.0的应用，页面访问数据采集不完整，请及时升级至2.4.0及以上版本【点击查看】。
      </a>
    </div>
    <Content v-if="boardInfoState.id" />
  </div>
</template>

<script setup lang="ts">
//新版质量周报详情页Index
import { useReportStore } from '@/store/modules/report'

import InfoCard from '@/pages/component/infoCard/index.vue'
import ReportFilterCard from '@/pages/component/filterCard/reportFilterCard.vue'

import Content from './totalContent.vue'
import { storeToRefs } from '@vben/stores'
import { computed } from 'vue'
import { versionStringCompare } from '@vben/utils'

const reprotStore = useReportStore()

const { boardInfoState } = storeToRefs(reprotStore)

const isSafeSDK = computed<boolean>(() =>
  Boolean(
    !reprotStore.latestSDKVersionState ||
      versionStringCompare(boardInfoState.value.sdk_version, '2.4.0') !== -1,
  ),
)
</script>
