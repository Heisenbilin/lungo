<template>
  <template v-if="!active">
    <a-tooltip>
      <template #title>
        该筛选条件仅生效于
        <a target="_blank" class="text-green-300">{{ filtersActiveTab[name]?.join('、') }}</a>
        栏目
      </template>
      <a-tag :color="active ? 'blue' : 'default'" class="min-h-8 !text-sm !rounded-md !flex items-center" closable
        @close="closeFilter">
        <template #icon> <minus-circle-outlined /></template>
        {{ title }}{{ title? '：': '' }}
        <slot name="content">{{ content }}</slot>
      </a-tag>
    </a-tooltip>
  </template>
  <template v-else>
    <a-tag :color="active ? 'blue' : 'default'" class="min-h-8 !text-sm !rounded-md !flex items-center" closable
      @close="closeFilter">
      {{ title }}{{ title? '：': '' }}
      <slot name="content">{{ content }}</slot>
    </a-tag>
  </template>
</template>
<script setup lang="ts">
import { useBoardStore } from '@/store/modules/board';
import { MinusCircleOutlined } from '@ant-design/icons-vue';
import { filtersActiveTab } from './filterConfig';

const boardStore = useBoardStore();

const props = defineProps({
  active: Boolean,
  title: String,
  content: String,
  name: {
    type: String,
    required: true,
  },
});

const closeFilter = () => {
  boardStore.delFilterValue(props.name);
};
</script>

<style lang="less" scoped>
:deep(a) {
  color: white;
  text-decoration: underline;
}
</style>
