<template>
  <div class="w-full">
    <router-link class="flex items-center" :to="linkToUrl">
      <span
        class="ml-2 text-gray-800 dark:text-gray-200 text-lg truncate trun-cate w-full"
        @click="() => useStoreProject(project, 'board')"
      >
        <a-tag v-if="project.saas === 'yes'" color="red">学科</a-tag>
        <a-tag v-else color="blue">素质</a-tag>
        <a-tooltip
          :overlayStyle="{ maxWidth: '400px' }"
          :title="`点击进入：${project.project_name}`"
        >
          {{ project.project_name }}
        </a-tooltip>
        <a-tag v-if="project.appid === '1001970'" color="cyan">编辑器</a-tag>
      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
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
// .card {
//   // position: relative;
//   display: flex;
//   align-items: center;
//   margin-right: 0px;
// }

:deep(.ant-tag) {
  height: 1.5rem;
}

:deep(a.ant-btn) {
  padding: 0;
}
</style>
