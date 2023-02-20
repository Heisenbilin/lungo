<template>
  <div class="p-4 bg-gray-100">
    <div class="grid grid-cols-2 gap-3">
      <div class="chart-container">
        <InfoCard boardType="report" />
      </div>
      <div v-if="boardInfoState.id" class="chart-container">
        <ReportFilterCard />
      </div>
    </div>

    <Content v-if="boardInfoState.id"/>
  </div>
</template>

<script setup lang="ts">
//新版质量周报详情页Index
import { useReportStore } from '@/store/modules/report'

import InfoCard from '@/pages/component/infoCard/index.vue'
import ReportFilterCard from '@/pages/component/filterCard/reportFilterCard.vue'

import Content from './totalContent.vue'
import { storeToRefs } from '@vben/stores'

const reprotStore = useReportStore()

const { boardInfoState } = storeToRefs(reprotStore)
</script>
