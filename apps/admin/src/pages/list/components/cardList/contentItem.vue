<template>
  <a-tooltip color="white" :overlayStyle="{ maxWidth: '400px' }">
    <template #title>
      <div class="text-gray-800">
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
        <div v-if="linkToUrl?.to !== ''">点击可查看本数据详情</div>
        <div v-else>编辑器应用未生成质量周报</div>
      </div>
    </template>
    <router-link v-if="!needGray" :to="linkToUrl" class="w-1/4">
      <div
        @click="() => useStoreProject(project, 'board')"
        class="grid justify-items-center content-center"
      >
        <!-- 正常 -->
        <div class="text-gray-500 text-base whitespace-nowrap">{{ title }}</div>
        <div class="flex my-1 items-end whitespace-nowrap">
          <div class="text-3xl text-gray-700 font-medium">
            {{ needCommafy ? commafy(parseFloat(data.todayData)) : parseFloat(data.todayRate) }}
          </div>
          <div class="text-gray-500" v-if="unit.length">{{ unit }}</div>
        </div>
        <div class="flex text-gray-500 whitespace-nowrap">
          较{{ last }}
          <span v-if="data.increaseRate === '0.00'" class="text-gray-600">
            {{ parseFloat(data.increaseRate) }}%-
          </span>
          <span
            v-else-if="!data.increaseRate.includes('-')"
            :class="reverseColor ? 'text-red-600' : 'text-green-600'"
          >
            {{ parseFloat(data.increaseRate) }}%<ArrowUpOutlined />
          </span>
          <span v-else :class="reverseColor ? 'text-green-600' : 'text-red-600'">
            {{ parseFloat(data.increaseRate.split('-')[1]) }}%<ArrowDownOutlined />
          </span>
        </div>
      </div>
    </router-link>
    <router-link v-else :to="linkToUrl" class="w-1/5 opacity-80">
      <!-- 具有一定灰度、字体更小 -->
      <div
        @click="() => useStoreProject(project, 'board')"
        class="grid justify-items-center content-center"
      >
        <div class="text-gray-500 whitespace-nowrap">{{ title }}</div>
        <div class="flex my-1 items-end">
          <div class="text-2xl text-gray-700 font-medium whitespace-nowrap">
            {{ needCommafy ? commafy(parseFloat(data.todayData)) : parseFloat(data.todayRate) }}
          </div>
          <div class="text-gray-500" v-if="unit.length">{{ unit }}</div>
        </div>
        <div class="flex text-gray-500 font-sm whitespace-nowrap justify-center">
          较{{ last }}
          <span v-if="data.increaseRate === '0.00'" class="text-gray-600">
            {{ parseFloat(data.increaseRate) }}%-
          </span>
          <span
            v-else-if="!data.increaseRate.includes('-')"
            :class="reverseColor ? 'text-red-600' : 'text-green-600'"
          >
            {{ parseFloat(data.increaseRate) }}%<ArrowUpOutlined />
          </span>
          <span v-else :class="reverseColor ? 'text-green-600' : 'text-red-600'">
            {{ parseFloat(data.increaseRate.split('-')[1]) }}%<ArrowDownOutlined />
          </span>
        </div>
      </div>
    </router-link>
  </a-tooltip>
</template>

<script setup lang="ts">
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'
import { commafy } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { storeToRefs } from '@vben/stores'
import { BoardInfo } from '@vben/types'
import { useStoreProject } from '@/hooks/board/useLink'

const boardStore = useBoardStore()

defineProps({
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
  reverseColor: {
    type: Boolean,
    default: false,
  },
  numName: {
    type: String,
    default: '',
  },
  linkToUrl: {
    type: Object,
    required: true,
  },
  project: {
    type: Object as PropType<BoardInfo>,
    required: true,
  },
})

const { filterState } = storeToRefs(boardStore)
const last = computed(() => (filterState.value.dimension === 'hour' ? '昨日' : '上周'))
const current = computed(() => (filterState.value.dimension === 'hour' ? '今日' : '本周'))
</script>

<style lang="less" scoped>
.font-sm {
  font-size: 0.5rem;
}
</style>
