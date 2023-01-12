<template>
  <div class="relative">
    <div class="flex flex-row justify-between">
      <router-link :to="boardUrl">
        <a-button
          type="link"
          class="!w-full"
          @click="() => useStoreProject(project, 'board', 'list')"
        >
          <AreaChartOutlined style="color: #7ed591" class="text-lg mr-1" />
          <span class="text-gray-700">监控</span>
        </a-button>
      </router-link>
      <router-link :to="dataBoardUrl">
        <a-button
          type="link"
          class="!w-full"
          @click="() => useStoreProject(project, 'panel', 'list')"
        >
          <PieChartOutlined style="color: #f77f00" class="text-lg mr-1" />
          <span class="text-gray-700">大盘</span>
        </a-button>
      </router-link>
      <div v-if="!isEditProject">
        <router-link :to="reportUrl">
          <a-button
            v-if="!isEditProject"
            type="link"
            class="!w-full"
            @click="() => useStoreProject(project, 'report', 'list')"
          >
            <FundOutlined style="color: #f07d70" class="text-lg mr-1" />
            <span class="text-gray-700">周报</span>
          </a-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AreaChartOutlined, FundOutlined, PieChartOutlined } from '@ant-design/icons-vue'
import { useLinkToUrl, useStoreProject } from '@/hooks/board/useLink'
import { BoardInfo } from '@vben/types'

const props = defineProps({
  project: {
    type: Object as PropType<BoardInfo>,
    required: true,
  },
})

//是否为编辑器应用
const isEditProject = props.project.appid === '1001970'
//点击监控跳转的路由
const boardUrl = useLinkToUrl(props.project.id, 'board')
//点击质量周报按钮跳转的路由
const reportUrl = useLinkToUrl(props.project.id, 'report')
//点击数据大盘按钮跳转的路由
const dataBoardUrl = useLinkToUrl(props.project.id, 'panel')
</script>
