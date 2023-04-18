<template>
  <div class="p-4 bg-color">
    <div class="grid grid-cols-2 gap-3">
      <div class="chart-container">
        <InfoCard boardType="board" />
      </div>
      <div v-if="boardInfoState.id" class="chart-container">
        <FilterCard />
      </div>
    </div>
    <Content v-if="boardInfoState.id" />
  </div>
</template>

<script setup lang="ts">
//新版性能监测详情页Index
import { useBoardStore } from '@/store/modules/board'
import { storeToRefs } from '@vben/stores'

import InfoCard from '../component/infoCard/index.vue'
import FilterCard from '../component/filterCard/index.vue'
import Content from './component/content.vue'


const boardStore = useBoardStore()

// 项目id
const { boardInfoState } = storeToRefs(boardStore)
</script>

<style lang="scss" scoped>
:deep(.ant-card) {
  border-radius: 0.5rem;
}
</style>
