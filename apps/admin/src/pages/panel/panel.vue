<template>
  <div class="p-4 bg-gray-100">
    <div class="grid grid-cols-2 gap-3">
      <div class="chart-container">
        <InfoCard boardType="panel" />
      </div>
      <div v-if="boardInfoState.id" class="chart-container">
        <FilterCard boardType="data" />
      </div>
    </div>
    <Content v-if="boardInfoState.id" />
  </div>
</template>

<script setup lang="ts">
//新版性能监测详情页Index
import { usePanelStore } from '@/store/modules/panel'
import { storeToRefs } from '@vben/stores'

import InfoCard from '../component/infoCard/index.vue'
import FilterCard from '../component/filterCard/index.vue'
import Content from './component/content.vue'

const panelStore = usePanelStore()

// 项目id
const { boardInfoState } = storeToRefs(panelStore)
</script>

<style lang="scss" scoped>
:deep(.ant-card) {
  border-radius: 0.5rem;
}
</style>
