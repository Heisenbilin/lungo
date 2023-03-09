<template>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <a-tab-pane key="all" tab="全部请求">
        <ResultTabTable type="all_interface" :searchUrl="searchValue" />
      </a-tab-pane>
      <a-tab-pane key="fail" tab="失败请求">
        <ResultTabTable type="fail_interface" :searchUrl="searchValue" />
      </a-tab-pane>
      <a-tab-pane key="allDomain" tab="全部请求页面统计">
        <ResultTabTable type="all_domain" />
      </a-tab-pane>
      <a-tab-pane key="failDomain" tab="失败请求页面统计">
        <ResultTabTable type="fail_domain" />
      </a-tab-pane>
      <template #rightExtra v-if="['all', 'fail'].includes(activeKey)">
        <div class="box-border w-80">
          <a-input-search v-model:value="searchValue" placeholder="请输入API URL关键词匹配" />
        </div>
      </template>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
//api异常数据汇总图表Tab框
import { ref } from 'vue'
import ResultTabTable from './resultTabTable.vue'
import { useAppTheme } from '@vben/hooks'
const { isDark } = useAppTheme()

//tab页key值与对应的看板type
const activeKey = ref<string>('all')

//搜索内容
const searchValue = ref<string>('')
</script>
