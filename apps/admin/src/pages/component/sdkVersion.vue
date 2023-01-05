<template>
  <span v-if="latestSDKVersion">
    <template v-if="props.currentSDKVersion === ''">
      <a-tooltip
        :overlayStyle="{ maxWidth: '300px' }"
        :title="`日志上报SDK可更新至${latestSDKVersion}版本，点击查看`"
        color="red"
      >
        <a href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log" target="_blank">
          <span>低于2.1.0&nbsp;</span><ExclamationCircleOutlined style="color: red" />
        </a>
      </a-tooltip>
    </template>
    <template v-else-if="props.currentSDKVersion !== latestSDKVersion">
      <a-tooltip
        :overlayStyle="{ maxWidth: '300px' }"
        :title="`日志上报SDK可更新至${latestSDKVersion}版本，点击查看`"
        color="red"
      >
        <a href="https://npm.100tal.com/#/detial?name=%40xes%2Fxes_fe_log" target="_blank">
          <span>{{ props.currentSDKVersion }}&nbsp;</span>
          <ExclamationCircleOutlined style="color: red" />
        </a>
      </a-tooltip>
    </template>
    <template v-else>
      <a-tooltip title="日志上报SDK已经是最新版本了" color="green">
        <span>{{ props.currentSDKVersion }}&nbsp;</span><CheckCircleOutlined style="color: green" />
      </a-tooltip>
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { boardStore } from '/@/store/modules/board';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  currentSDKVersion: {
    type: String,
    default: '',
  },
});

const latestSDKVersion = computed(() => boardStore.getLatestSDKVersionState);
</script>
