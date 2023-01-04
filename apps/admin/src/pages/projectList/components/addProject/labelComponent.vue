<template>
  <span>
    知音楼通知提醒手动输入
    <a-tooltip :overlayStyle="{ maxWidth: '346px' }">
      <template #title>
        1.参数有效期选择大于等于48小时会在周六19点通知<br />
        2.参数有效期选择大于等于24小时会在周日19点通知<br />
        3.参数有效期选择小于24小时会在周一9：30通知
      </template>
      <InfoCircleOutlined />
    </a-tooltip>
  </span>
</template>

<script setup lang="ts">
import { InfoCircleOutlined } from '@ant-design/icons-vue';
</script>
