<template>
  <a-tooltip
    overlayClassName="bg-$component-background-color"
    :overlayStyle="{ maxWidth: '400px' }"
  >
    <template #title>
      <div v-if="data.score !== undefined">
        得分：<span :style="{ color: barFinColor(data.score) }">{{ data.score }}</span>
      </div>
      <div v-if="needCommafy">
        {{ last }}同比{{ title }}：{{ commafy(parseFloat(data.yesterdayData))
        }}{{ unit.length ? unit : '' }}
      </div>
      <div v-else>
        {{ current }}{{ numName }}：{{ commafy(parseFloat(data.todayData))
        }}{{
          data.todayTotalData !== undefined
            ? `（总请求量：${commafy(parseFloat(data.todayTotalData))})`
            : ''
        }}
        <br />
        {{ current }}{{ title }}：{{ parseFloat(data.todayRate) }}%
        <br />
        {{ last }}同比{{ numName }}：{{ commafy(parseFloat(data.yesterdayData))
        }}{{
          data.yesterTotalData !== undefined
            ? `（总请求量：${commafy(parseFloat(data.yesterTotalData))})`
            : ''
        }}
        <br />
        {{ last }}同比{{ title }}：{{ parseFloat(data.yesterdayRate) }}%
      </div>
      <div>
        较{{ last }}
        <span v-if="data.increaseRate === '0.00'" class="text-gray-400">
          {{ parseFloat(data.increaseRate) }}%-
        </span>
        <span
          v-else-if="!data.increaseRate.includes('-')"
          :class="reverseColor ? 'text-red-600' : 'text-green-600'"
        >
          {{ parseFloat(data.increaseRate) }}%
          <ArrowUpOutlined />
        </span>
        <span v-else :class="reverseColor ? 'text-green-600' : 'text-red-600'">
          {{ parseFloat(data.increaseRate.split('-')[1]) }}%
          <ArrowDownOutlined />
        </span>
      </div>
      <div>点击可查看本数据详情</div>
    </template>
    <router-link v-if="!needGray" class="grid justify-items-center center w-full" :to="linkToUrl">
      <!-- 正常 -->
      <div
        class="flex my-1 items-center whitespace-nowrap center"
        @click="() => useStoreProject(project, 'board')"
      >
        <div class="text-1xl text-gray-700 font-medium center text-color!">
          {{ needCommafy ? commafy(parseFloat(data.todayData)) : parseFloat(data.todayRate) }}
        </div>
        <div class="text-gray-500 center" v-if="unit.length">{{ unit }}</div>
        <span v-if="data.increaseRate === '0.00'" class="text-gray-400"> </span>
        <span
          v-else-if="!data.increaseRate.includes('-')"
          :class="reverseColor ? 'text-red-600' : 'text-green-600'"
        >
          <ArrowUpOutlined />
        </span>
        <span v-else :class="reverseColor ? 'text-green-600' : 'text-red-600'">
          <ArrowDownOutlined />
        </span>
      </div>
    </router-link>
    <router-link
      v-else
      class="grid justify-items-center content-center w-full opacity-80"
      :to="linkToUrl"
    >
      <!-- 具有一定灰度、字体更小 -->
      <div class="flex my-1 items-center center" @click="() => useStoreProject(project, 'board')">
        <div class="text-1xl text-gray-700 font-medium whitespace-nowrap center text-color!">
          {{ needCommafy ? commafy(parseFloat(data.todayData)) : parseFloat(data.todayRate) }}
        </div>
        <div class="text-gray-500 center text-color!" v-if="unit.length">{{ unit }}</div>
        <span v-if="data.increaseRate === '0.00'" class="text-gray-400"> </span>
        <span
          v-else-if="!data.increaseRate.includes('-')"
          :class="reverseColor ? 'text-red-600' : 'text-green-600'"
        >
          <ArrowUpOutlined />
        </span>
        <span v-else :class="reverseColor ? 'text-green-600' : 'text-red-600'">
          <ArrowDownOutlined />
        </span>
      </div>
    </router-link>
  </a-tooltip>
</template>
<script setup lang="ts">
import { commafy } from '@vben/utils'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
import { useLinkToUrl, useStoreProject } from '@/hooks/board/useLink'
import { BoardInfo } from '@vben/types'
import { useListStore } from '@/store/modules/list'
import { computed } from 'vue'
import { storeToRefs } from '@vben/stores'
import { barFinColor } from '../utils'

const props = defineProps({
  data: { type: Object, required: false, default: () => ({}) },
  title: { type: String, required: true },
  unit: { type: String, default: '' },
  needCommafy: { type: Boolean, default: false },
  reverseColor: { type: Boolean, default: false },
  numName: { type: String, default: '' },
  needGray: { type: Boolean, default: false },
  tabKey: { type: String, default: 'pageview' },
  project: { type: Object as PropType<BoardInfo>, required: true },
})

const listStore = useListStore()
const { dimension } = storeToRefs(listStore)
const last = computed(() => (dimension.value === 'week' ? '上周' : '昨日'))
const current = computed(() => (dimension.value === 'week' ? '本周' : '今日'))
const linkToUrl = useLinkToUrl(props.project.id, 'board', 'list', props.tabKey)
</script>
