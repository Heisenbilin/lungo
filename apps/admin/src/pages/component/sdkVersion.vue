<template>
  <span v-if="latestSDKVersionState">
    <template v-if="currentSDKVersion === ''">
      <a-tooltip :overlayStyle="{ maxWidth: '300px' }" :title="`日志上报SDK可更新至${latestSDKVersionState}版本，点击查看`"
        color="red">
        <a href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log" target="_blank">
          <span>低于2.1.0&nbsp;</span>
          <ExclamationCircleOutlined style="color: red" />
        </a>
      </a-tooltip>
    </template>
    <template v-else-if="currentSDKVersion !== latestSDKVersionState">
      <a-tooltip :overlayStyle="{ maxWidth: '300px' }" :title="`日志上报SDK可更新至${latestSDKVersionState}版本，点击查看`"
        color="red">
        <a href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log" target="_blank">
          <span>{{ currentSDKVersion }}&nbsp;</span>
          <ExclamationCircleOutlined style="color: red" />
        </a>
      </a-tooltip>
    </template>
    <template v-else>
      <a-tooltip title="日志上报SDK已经是最新版本了" color="green">
        <span>{{ currentSDKVersion }}&nbsp;</span>
        <CheckCircleOutlined style="color: green" />
      </a-tooltip>
    </template>
  </span>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/store/modules/board';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from '@vben/stores'

const boardStore = useBoardStore();

defineProps({
  currentSDKVersion: {
    type: String,
    default: '',
  },
});

const { latestSDKVersionState } = storeToRefs(boardStore);
</script>
