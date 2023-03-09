<template>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full" @change="handleTabChange">
      <a-tab-pane key="success" tab="全部请求">
        <ResultTabTable type="success" v-model:searchUrl="tabSearchValue.successUrl" />
      </a-tab-pane>
      <a-tab-pane key="fail" tab="失败请求">
        <ResultTabTable type="fail" v-model:searchUrl="tabSearchValue.failUrl" />
      </a-tab-pane>
      <template #rightExtra>
        <div class="box-border w-80">
          <a-input-search
            v-model:value="searchValue"
            placeholder="请输入URL关键词匹配"
            @search="onSearch"
          />
        </div>
      </template>
    </a-tabs>
  </div>
</template>

<script setup>
//api异常数据汇总图表Tab框
import { reactive, ref, watch } from 'vue'
import ResultTabTable from './resultTabTable.vue'
import { useAppTheme } from '@vben/hooks'
const { isDark } = useAppTheme()

//tab页key值与对应的看板type
const activeKey = ref('success')

//搜索内容
const searchValue = ref('')
const tabSearchValue = reactive({
  successUrl: '',
  failUrl: '',
})

const onSearch = value => {
  if (activeKey.value === 'success') tabSearchValue.successUrl = value.trim()
  if (activeKey.value === 'fail') tabSearchValue.failUrl = value.trim()
}

watch(tabSearchValue, val => {
  searchValue.value = val.successUrl || val.failUrl
})

//tab页切换时
const handleTabChange = () => {
  searchValue.value = tabSearchValue.successUrl = tabSearchValue.failUrl = ''
}
</script>
