<template>
  <a-tooltip color="white" :overlayStyle="{ maxWidth: '400px' }">
    <template #title>
      <div class="text-gray-800">
        <div v-if="linkToUrl.name !== ''">点击可查看本数据详情</div>
        <div v-else>编辑器应用未生成质量周报</div>
      </div>
    </template>
    <router-link v-if="!needGray" class="grid justify-items-center center w-full" :to="linkToUrl">
      <!-- 正常 -->
      <div class="flex my-1 items-center whitespace-nowrap center" @click="() => useStoreProject(project, 'board')">
        <div class="text-1xl text-gray-700  font-medium center text-color">
          {{ needCommafy ? commafy(parseFloat(data.todayData)) : parseFloat(data.todayRate) }}
        </div>
        <div class="text-gray-500 center" v-if="unit.length">{{ unit }}</div>
      </div>
    </router-link>
    <router-link v-else class="grid justify-items-center content-center w-full opacity-80" :to="linkToUrl">
      <!-- 具有一定灰度、字体更小 -->

      <div class="flex my-1 items-center center" @click="() => useStoreProject(project, 'board')">
        <div class="text-1xl text-gray-700 font-medium whitespace-nowrap center text-color">
          {{ needCommafy ? commafy(parseFloat(data.todayData)) : parseFloat(data.todayRate) }}
        </div>
        <div class="text-gray-500 center text-color"  v-if="unit.length">{{ unit }}
        </div>
      </div>
    </router-link>
  </a-tooltip>
</template>
<script setup lang="ts">
import { commafy } from '@vben/utils'
// import {a-tooltip} from 'ant-design-vue'
import { useLinkToUrl, useStoreProject } from '@/hooks/board/useLink'
import { BoardInfo } from '@vben/types'

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  title: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: '',
  },
  needCommafy: {
    type: Boolean,
    default: false,
  },
  needGray: {
    type: Boolean,
    default: false,
  },
  tabKey: {
    type: String,
    default: 'pageview',
  },
  project: {
    type: Object as PropType<BoardInfo>,
    required: true,
  },
})

const linkToUrl = useLinkToUrl(props.project.id, 'board', 'list', props.tabKey)
</script>

<style lang="less" scoped>
.font-sm {
  font-size: 0.5rem;
}

:deep(.ant-table-row-cell-break-word) {
  text-align: center;
}
</style>
