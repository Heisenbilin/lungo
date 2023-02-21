<template>
  <div v-if="loading" class="flex justify-center items-center h-full">
    <a-spin size="small" />
  </div>
  <div v-else-if="!data.itemsData && !loading" class="flex justify-center items-center h-full">
    <a-empty :image="simpleImage" />
  </div>
  <template v-else>
    <tableContentMiddle
      :title="title"
      :project="data"
      :itemsData="data.itemsData"
    />
  </template>
</template>
<script setup lang="ts">
import { BoardInfo } from '@vben/types'
import { Empty } from 'ant-design-vue'
import tableContentMiddle from './tableContentMiddle.vue'
defineProps({
  projectId: {
    type: Number,
    required: true,
  },
  title: String,
  data: {
    type: Object as PropType<BoardInfo>,
    required: true,
  },
  loading: Boolean,
})


const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>
