<template>
  <template v-for="(config, key) in linkTextArr" :key="key">
    <span v-if="!config.isLink" :id="'text' + key">{{ config.text }}</span>
    <a v-else :href="config.linkHref" :alt="config.linkHref" target="_blank">{{ config.text }}</a>
    <!-- <span v-else :id="'text'+key">{{config.text}}</span> -->
  </template>
</template>

<script setup lang = 'ts'>
import { splitMarkdownLink } from './util';
import { ref } from 'vue';

//链接文字渲染组件
  // props: ['text'],
const props = defineProps({
  text: String,
})
    const linkTextArr = ref(splitMarkdownLink(props.text));
</script>

<style scoped lang="scss">
@import './weekly.scss';
</style>
