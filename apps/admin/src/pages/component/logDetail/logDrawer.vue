<template>
  <a-drawer
    :visible="logVisible"
    width="1000px"
    :bodyStyle="{ paddingTop: '10px' }"
    :headerStyle="{ padding: '0px 20px' }"
    @close="handleCancel"
    :footer="null"
    :closable="false"
  >
    <template #title>
      <div class="flex justify-between">
        <div class="self-center">{{ drawerName }}</div>
        <div class="flex min-h-16 items-center mr-20">
          <a-radio-group v-model:value="activeName">
            <a-radio-button value="recent">最近1次</a-radio-button>
            <a-radio-button value="more">查看更多</a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </template>
    <LogContent
      v-if="activeName === 'recent'"
      :loading="recentContentLoading"
      :content="recentContent"
    />
    <LogTable v-if="activeName === 'more'" :boardType="boardType" />
  </a-drawer>
</template>

<script setup>
// 日志详情抽屉
import { computed, ref } from 'vue';
import { getDataList } from './util';
import { getRequestParameters } from '/@/utils/index';
import { boardStore, reportStore } from '/@/store/modules/board';
import LogContent from './logContent.vue';
import LogTable from './logTable.vue';

const props = defineProps({
  boardType: {
    type: String,
    default: 'general',
  },
});

const store = props.boardType === 'general' ? boardStore : reportStore;

// 抽屉可视
const logVisible = computed(() => {
  const visible = store.getLogInfoState.visible;
  if (visible) getRecentData(); // 打开抽屉时请求最近一次日志数据
  return visible;
});
const type = computed(() => store.getLogInfoState.type); // 抽屉类型
const params = computed(() => store.logRequestParams); //请求参数
const ua_flag = computed(() => store.getBoardInfoState.ua_flag); //ua关键字

//抽屉名称
const drawerName = computed(() => {
  switch (type.value) {
    case 'performance':
      return '页面性能日志详情';
    case 'runtime':
      return '运行时异常日志详情';
    case 'resource':
      return '资源异常日志详情';
    case 'faultTolerant':
      return '资源容错日志详情';
    case 'api':
      return '接口异常日志详情';
    case 'gateway':
      return '网关监控日志详情';
    default:
      return '日志详情';
  }
});

let activeName = ref('recent');

//最近一次
const recentContent = ref({});
const recentContentLoading = ref(true);

//为最近1次日志请求数据
const getRecentData = async () => {
  activeName.value = 'recent';
  recentContentLoading.value = true;
  const { result } = await getDataList(type.value, params.value, 1, 1, ua_flag.value);
  recentContent.value = result[0];
  recentContentLoading.value = false;
};

const initDrawer = () => {
  // 路由中若有log_type参数，打开日志详情
  const urlParams = getRequestParameters();
  if ('log_type' in urlParams && 'log_params' in urlParams) {
    try {
      store.openLogInfoState({
        type: urlParams.log_type,
        visible: true,
        requestParams: JSON.parse(urlParams.log_params),
      });
    } catch (e) {
      console.log('路由中的参数非法导致窗口打开错误', e);
    }
  }
};
initDrawer();

//关闭抽屉逻辑
function handleCancel() {
  store.closeLogInfoState();
}
</script>
