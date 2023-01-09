<template>
  <div v-if="loading" class="flex justify-center items-center h-full">
    <a-spin size="small" />
  </div>
  <div v-else-if="!data.itemsData && !loading" class="flex justify-center items-center h-full">
    <a-empty :image="simpleImage" />
  </div>
  <template v-else>
    <tableContentMiddle :linkToUrl="linkToUrl" :title="title" :itemsData="data.itemsData" />
  </template>
</template>
<script setup lang="ts">
import { useLinkToUrl } from '@/hooks/board/useLink'
import { Empty } from 'ant-design-vue'
import tableContentMiddle from './tableContentMiddle.vue'
const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
  title: String,
  data: {
    type: Object,
    required: true,
  },
  loading: Boolean,
})

const linkToUrl = useLinkToUrl(props.projectId, 'board')

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>
