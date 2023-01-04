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
  import { computed } from 'vue';
  import { Empty } from 'ant-design-vue';
  import tableContentMiddle from './tableContentMiddle.vue';
  const props = defineProps({
    projectId: {
      type: Number,
      required: true,
    },
    title: String,
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    loading: Boolean,
  });
  const linkToUrl = computed(() => {
    if (props.type === 'board') {
      return `/projectboard/boardInfo/${props.projectId}`;
    }
    return `/huatuo/board/${props.projectId}`;
  });

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

</script>
