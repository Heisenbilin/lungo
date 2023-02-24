<template>
  <Tooltip
    v-if="latestSDKVersion.length && project.sdk_version !== latestSDKVersion"
    :overlayStyle="{ maxWidth: '300px' }"
    :title="`日志上报SDK可更新至${latestSDKVersion}版本，点击查看`"
    color="orange"
  >
    <Button
      type="link"
      href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log"
      target="_blank"
      style="padding: 0"
    >
      <Tag color="warning" class="h-5">
        {{ project.sdk_version === '' ? '&lt;2.1.0' : project.sdk_version }}
      </Tag>
    </Button>
  </Tooltip>
  <Tooltip v-else-if="latestSDKVersion.length" title="日志上报SDK已经是最新版本了" color="green">
    <Tag color="success" class="h-5">
      {{ project.sdk_version }}
    </Tag>
  </Tooltip>
</template>

<script setup lang="ts">
import {Tag ,Tooltip,Button} from 'ant-design-vue'
defineProps({
  project: {
    type: Object,
    required: true,
  },
  latestSDKVersion: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.card {
  // position: relative;
  display: flex;
  align-items: center;
}

:deep(.ant-tag) {
  height: 1.5rem;
}
</style>
