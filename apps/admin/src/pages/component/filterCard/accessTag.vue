<template>
  <a-tag
    :color="access ? 'success' : 'warning'"
    class="min-h-8 !text-sm !rounded-md !flex items-center"
  >
    <template #icon>
      <CheckCircleOutlined v-if="access" />
      <ExclamationCircleOutlined v-else />
    </template>
    {{ accessTagConfig[name].title }}：
    <slot name="content" v-if="access">已接入</slot>
    <slot name="content" v-else
      >未接入,<a :href="accessTagConfig[name].doc" target="_blank"> 查看接入文档 </a>
    </slot>
  </a-tag>
</template>
<script setup lang="ts">
import { accessTagConfig } from './filterConfig'
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'

defineProps({
  access: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
:deep(a) {
  color: #096dd9 !important;
  text-decoration: underline;
}
</style>
