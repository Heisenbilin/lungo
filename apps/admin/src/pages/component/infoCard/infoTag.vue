<template>
  <a-tag color="blue" class="min-h-8 !leading-6 !py-1 !text-sm !rounded-md !text-wh !whitespace-normal">
    {{ props.title }}{{ props.title ? '：' : '' }}
    <slot name="content">{{ props.content }}</slot>
  </a-tag>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  content: String,
});
</script>

<style lang="scss" scoped>
:deep(a) {
  color: #096dd9 !important;
  text-decoration: underline;
}
</style>
