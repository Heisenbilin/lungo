<template>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <a-tab-pane key="content" tab="异常详情">
        <ResultTabTable type="content" :searchValue="searchValue" />
      </a-tab-pane>
      <a-tab-pane key="domain" tab="异常发生页面统计">
        <ResultTabTable type="domain" />
      </a-tab-pane>
      <template #rightExtra v-if="activeKey === 'content'">
        <div class="box-border w-80">
          <a-input-search
            v-model:value="searchValue"
            placeholder="请输入异常内容关键词匹配"
            @search="onSearch"
          />
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
const activeKey = ref('content')

//搜索内容
const searchValue = ref('')

const onSearch = value => {
  searchValue.value = value.trim()
}
</script>
