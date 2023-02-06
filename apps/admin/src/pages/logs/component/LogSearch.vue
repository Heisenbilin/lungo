<script lang="ts">
/* eslint-disable vue/no-mutating-props */
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { LogQuery } from '@/apis/logs/api';
import { Action } from '@/apis/logs/api';

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<LogQuery>,
      default: () => ({}),
    },
  },
  emits: ['date-change', 'search'],
  setup(_props, { emit }) {
    const onDateChange = ([startTime, endTime]) => {
      emit('date-change', {
        start_time: startTime,
        end_time: endTime,
      });
    };

    const handleSearch = () => {
      emit('search');
    };

    return {
      Action,
      onDateChange,
      handleSearch,
    };
  },
});
</script>
<template>
  <div class="m-5">
  <div class="flex justify-between items-center">
    <a-form layout="inline">
      <a-form-item>
        <a-input v-model:value="query.project_name" placeholder="请输入项目名称" allowClear />
      </a-form-item>
      <a-form-item>
        <a-select
          class="!w-140px"
          v-model:value="query.action"
          placeholder="请选择操作类型"
          allowClear
        >
          <a-select-option :value="Action.CREATE">新增</a-select-option>
          <a-select-option :value="Action.UPDATE">修改</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-input v-model:value="query.user_account" placeholder="请输入用户邮箱前缀" allowClear />
      </a-form-item>
      <a-form-item>
        <a-input v-model:value="query.data_field" placeholder="请输入字段名" allowClear />
      </a-form-item>
      <a-form-item>
        <a-range-picker
          show-time
          @change="onDateChange"
          class="!w-380px"
          valueFormat="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-item>
    </a-form>
    <a-button type="primary" @click="handleSearch">搜索</a-button>
  </div>
  </div>
</template>
