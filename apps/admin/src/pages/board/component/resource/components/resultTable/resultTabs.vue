<template>
  <div class="chart-container-full" :style="{ 'background-color': isDark ? 'rgb(20,20,20)' : '' }">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <a-tab-pane key="resource" tab="异常资源">
        <ResultTabTable type="href" :searchValue="searchValue" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="异常发生页面统计">
        <ResultTabTable type="domain" />
      </a-tab-pane>
      <a-tab-pane key="faultTolerant" tab="容错成功资源" v-if="props.faultTolerantStatus === 'accessed'">
        <ResultTabTable type="faultTolerant" />
      </a-tab-pane>
      <template #rightExtra v-if="activeKey === 'resource'">
        <div class="box-border w-80">
          <a-input-search v-model:value="searchValue" placeholder="输入关键词进行搜索" @search="onSearch" />
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
const props = defineProps({
  faultTolerantStatus: {
    type: String,
    required: true,
  },
})

//tab页key值与对应的看板type
const activeKey = ref('resource')

//搜索内容
const searchValue = ref('')

const onSearch = value => {
  searchValue.value = value.trim()
}
</script>
