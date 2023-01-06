<script setup lang="ts">
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import VueJsonPretty from 'vue-json-pretty';
import { Action } from './api';
import { useGetLogs } from './hooks';
import LogSearch from './components/LogSearch.vue';

/**
 * 请求操作日志列表
 */
const {
  query,
  pagination,
  logs,
  loading,
  onDateChange,
  handleTableChange,
  handleSearch,
} = useGetLogs();
</script>
<template>
  <div>
    <LogSearch :query="query" @date-change="onDateChange" @search="handleSearch" />

    <div class="mt-4">
      <a-table
        :data-source="logs"
        bordered
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
      >
        <a-table-column title="id" key="ID" data-index="id" />
        <a-table-column title="项目名称" key="data_name" data-index="data_name" />
        <a-table-column title="操作类型" key="action">
          <template #default="{ record: { action } }">
            <a-tag v-if="action === Action.CREATE" color="green">新增</a-tag>
            <a-tag v-else color="orange">修改</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="字段" key="data_field" data-index="data_field" />
        <a-table-column title="旧值" key="old_data" width="300px">
          <template #default="{ record: { old_data } }">
            {{ old_data }}
          </template>
        </a-table-column>
        <a-table-column title="新值" key="new_data" width="300px">
          <template #default="{ record: { new_data, action } }">
            <span v-if="action === Action.UPDATE">{{ new_data }}</span>
            <a-popover title="详情" v-else>
              <template #content>
                <!-- <pre>{{ JSON.stringify(JSON.parse(new_data), null, 2) }}</pre> -->
                <VueJsonPretty :data="JSON.parse(new_data)" />
              </template>
              <a-button size="small" type="primary">详情</a-button>
            </a-popover>
          </template>
        </a-table-column>
        <a-table-column title="操作用户" key="user_account" data-index="user_account" />
        <a-table-column title="操作时间" key="create_time" data-index="create_time" />
      </a-table>
    </div>
  </div>
</template>
