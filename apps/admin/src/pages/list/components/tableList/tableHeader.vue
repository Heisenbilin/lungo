<template>
  <div class="relative">
    <div class="card">
      <router-link class="flex items-center px-0 py-3" :to="linkToUrl" style="width: 100%">
        <span
          class="ml-2 text-gray-800 text-lg truncate trun-cate w-64"
          @click="() => useStoreProject(project, 'board')"
        >
          <Tag v-if="project.saas === 'yes'" color="red">学科</Tag>
          <Tag v-else color="blue">素质</Tag>
          {{ project.project_name }}
          <Tag v-if="project.appid === '1001970'" color="cyan">编辑器</Tag>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Tag} from 'ant-design-vue'
import { useLinkToUrl, useStoreProject } from '@/hooks/board/useLink'
import { BoardInfo } from '@vben/types'

const props = defineProps({
  project: {
    type: Object as PropType<BoardInfo>,
    required: true,
  },
})

const linkToUrl = useLinkToUrl(props.project.id, 'board', 'list')
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
