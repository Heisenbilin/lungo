<template>
  <a-tooltip color="white" :overlayStyle="{ maxWidth: '400px' }">
    <template #title>
      <div class="text-gray-800">
        <div v-if="jumpUrl !== ''">点击可查看本数据详情</div>
        <div v-else>编辑器应用未生成质量周报</div>
      </div>
    </template>
    <router-link v-if="!needGray" class="grid justify-items-center center w-full" :to="jumpUrl">
      <!-- 正常 -->
      <div class="flex my-1 items-center whitespace-nowrap center">
        <div class="text-1xl text-gray-700 font-medium center">
          {{ needCommafy ? commafy(parseFloat(data.todayData)) : parseFloat(data.todayRate) }}
        </div>
        <div class="text-gray-500 center" v-if="unit.length">{{ unit }}</div>
      </div>
    </router-link>
    <router-link
      v-else
      class="grid justify-items-center content-center w-full opacity-80"
      :to="jumpUrl"
    >
      <!-- 具有一定灰度、字体更小 -->

      <div class="flex my-1 items-center center">
        <div class="text-1xl text-gray-700 font-medium whitespace-nowrap center">
          {{ needCommafy ? commafy(parseFloat(data.todayData)) : parseFloat(data.todayRate) }}
        </div>
        <div class="text-gray-500 center" v-if="unit.length">{{ unit }}</div>
      </div>
    </router-link>
  </a-tooltip>
</template>
<script setup lang="ts">
// import { computed } from 'vue';
import { commafy } from "@vben/utils";
// import { boardStore } from '/@/store/modules/board';

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
    default: "",
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
    default: "",
  },
  jumpUrl: {
    type: String,
    default: "",
  },
});
// const dimension = computed(() => boardStore.getFilterState.dimension);
// const last = computed(() => (dimension.value === 'hour' ? '昨日' : '上周'));
// const current = computed(() => (dimension.value === 'hour' ? '今日' : '本周'));
</script>

<style lang="less" scoped>
.font-sm {
  font-size: 0.5rem;
}
:deep(.ant-table-row-cell-break-word) {
  text-align: center;
}
</style>
