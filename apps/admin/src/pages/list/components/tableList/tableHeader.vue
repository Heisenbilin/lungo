<template>
  <div class="relative">
    <div class="card">
      <router-link class="flex items-center px-0 py-3" :to="linkToUrl" style="width: 100%">
        <a-tag v-if="project.saas === 'yes'" color="red">学科</a-tag>
        <a-tag v-else color="blue">素质</a-tag>
        <span class="ml-2 text-gray-800 text-lg truncate trun-cate w-64">
          {{ project.project_name }}
        </span>
        <a-tag v-if="project.appid === '1001970'" color="cyan">编辑器应用</a-tag>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLinkToUrl } from '@/hooks/board/useLink'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const linkToUrl = useLinkToUrl(props.project.id, 'board')
</script>

<style lang="scss" scoped>
.card {
  // position: relative;
  display: flex;
  align-items: center;
  margin-right: 0px;
}

:deep(.ant-tag) {
  height: 1.5rem;
}

:deep(a.ant-btn) {
  padding: 0;
}
</style>
