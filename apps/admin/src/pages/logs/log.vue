<script setup lang="ts">
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import VueJsonPretty from 'vue-json-pretty'
import { Action } from '@/apis/logs/api'
import { useGetLogs } from './hooks'
import LogSearch from './component/LogSearch.vue'
import type { TableColumnsType } from 'ant-design-vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
/**
 * 请求操作日志列表
 */

const { query, pagination, logs, loading, onDateChange, handleTableChange, handleSearch } =
  useGetLogs()

const columns: TableColumnsType = [
  {
    title: 'id',
    key: 'ID',
    dataIndex: 'id',
  },
  {
    title: '项目名称',
    key: 'data_name',
    dataIndex: 'data_name',
  },
  {
    title: '操作类型',
    key: 'action',
  },
  {
    title: '字段',
    key: 'data_field',
    dataIndex: 'data_field',
  },
  {
    title: '旧值',
    key: 'old_data',
    width: 300,
  },
  {
    title: '新值',
    key: 'new_data',
    width: 300,
  },
  {
    title: '操作用户',
    key: 'user_account',
    dataIndex: 'user_account',
  },
  {
    title: '操作时间',
    key: 'create_time',
    dataIndex: 'create_time',
  },
]
</script>
<template>
  <div v-if="userStore.isAdminUser">无权限</div>
  <div v-else>
    <LogSearch :query="query" @date-change="onDateChange" @search="handleSearch" />
    <div class="mt-4 mr-4 ml-4">
      <a-table
        :data-source="logs"
        bordered
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        :columns="columns"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-tag v-if="record.action === Action.CREATE" color="green">新增</a-tag>
            <a-tag v-else color="orange">修改</a-tag>
          </template>
          <template v-if="column.key === 'old_data'">
            {{ record.old_data }}
          </template>
          <template v-if="column.key === 'new_data'">
            <span v-if="record.action === Action.UPDATE">{{ record.new_data }}</span>
            <a-popover title="详情" v-else>
              <template #content>
                <!-- <pre>{{ JSON.stringify(JSON.parse(new_data), null, 2) }}</pre> -->
                <VueJsonPretty :data="JSON.parse(record.new_data)" />
              </template>
              <a-button size="small" type="primary">详情</a-button>
            </a-popover>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-table-tbody > tr > td) {
  max-width: 300px;
}
</style>
