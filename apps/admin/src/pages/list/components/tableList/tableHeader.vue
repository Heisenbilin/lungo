<template>
  <div class="relative">
    <div class="card">
      <router-link class="flex items-center px-0 py-3" :to="linkToUrl" style="width: 100%">
        <span :class="['ml-2', { 'text-gray-800': !isDark }, 'text-lg', 'truncate', 'trun-cate', ' w-64']"
          @click="() => useStoreProject(project, 'board')">
          <a-tag v-if="project.saas === 'yes'" color="red">学科</a-tag>
          <a-tag v-else color="blue">素质</a-tag>
          {{ project.project_name }}
          <a-tag v-if="project.appid === '1001970'" color="cyan">编辑器</a-tag>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// import {a-tag} from 'ant-design-vue'
import { useLinkToUrl, useStoreProject } from '@/hooks/board/useLink'
import { BoardInfo } from '@vben/types'
import { useAppTheme } from '@vben/hooks';
const { isDark } = useAppTheme()

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
