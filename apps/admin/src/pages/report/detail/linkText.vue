<template>
  <template v-for="(config, key) in linkTextArr" :key="key">
    <span v-if="!config.isLink" :id="'text' + key">{{ config.text }}</span>
    <a v-else :href="config.linkHref" :alt="config.linkHref" target="_blank">{{ config.text }}</a>
    <!-- <span v-else :id="'text'+key">{{config.text}}</span> -->
  </template>
</template>

<script setup lang="ts">
//链接文字渲染组件
import { splitMarkdownLink } from './util'
import { ref } from 'vue'

const props = defineProps({
  text: String,
})

const linkTextArr = ref(splitMarkdownLink(props.text))
</script>
