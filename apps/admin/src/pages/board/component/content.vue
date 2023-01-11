<template>
  <div id="general-board-container" class="p-2 mt-3">
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="pageview" tab="页面访问">
        <PVBoard v-if="activeKey === 'pageview'" />
      </a-tab-pane>
      <a-tab-pane key="performance" tab="性能指标">
        <PerformanceBoard v-if="activeKey === 'performance'" :platformType="props.platformType" />
      </a-tab-pane>
      <a-tab-pane key="runtime" tab="运行时异常">
        <RuntimeErrorBoard v-if="activeKey === 'runtime'" />
      </a-tab-pane>
      <a-tab-pane key="resource" tab="资源异常">
        <ResourceErrorBoard v-if="activeKey === 'resource'" />
      </a-tab-pane>
      <a-tab-pane key="api" tab="接口异常">
        <ApiErrorBoard v-if="activeKey === 'api'" />
      </a-tab-pane>
      <a-tab-pane key="gateway" tab="网关监控">
        <GatewayBoard v-if="activeKey === 'gateway'" />
      </a-tab-pane>
    </a-tabs>
  </div>
  <LogDrawer />
  <FAQ />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// import { useStore } from 'vuex';
import { getUrlParams } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { useWatermark } from '@vben/hooks'
import { tabListEnum } from '@vben/constants'
import { storeToRefs } from 'pinia'

import PVBoard from './pv/index.vue'
import PerformanceBoard from './performance/index.vue'
import RuntimeErrorBoard from './runtime/index.vue'
import ResourceErrorBoard from './resource/index.vue'
import ApiErrorBoard from './apiError/index.vue'
import GatewayBoard from './gateway/index.vue'
import LogDrawer from '../../component/logDetail/logDrawer.vue'
import FAQ from '../../component/FAQ.vue'
import intro from 'intro.js'
import 'intro.js/introjs.css'

//数据看板：管理时间、维度与展示tab
const props = defineProps({
  platformType: {
    type: String,
  },
})

const boardStore = useBoardStore()
// const store = useStore();

const username = 'xiongbilin'

// //页面筛选
// const urlSelectValue = ref('所有页面');
// const urlSelectList = ref({ board_url: '所有页面' });

//tab页key值
const { tabState: activeKey } = storeToRefs(boardStore)
//将路由中的tabkey与activeKey同步
const { tabkey = 'pageview' } = getUrlParams()
if (tabListEnum[tabkey] ? tabkey : 'pageview') {
  activeKey.value = tabkey
}

//tab页的key值与路由绑定

onMounted(() => {
  createWatermark()
})

//获取项目下的所有URL
// const getUrls = async () => {
//   let params = {
//     project_id: props.projectInfo.id,
//     start_time: '2022-04-18' || startTime.value.split(' ')[0],
//     end_time: '2022-04-25' || endTime.value.split(' ')[0],
//     page: 1,
//   };
//   const result = await reportApis.getList(params);
//   console.log(result);
//   if (result.msg === 'success' && result.data?.projectList?.length) {
//     result.data.projectList.unshift({ board_url: '所有页面' });
//     urlSelectList.value = result.data.projectList;
//   } else {
//     urlSelectList.value = [{ board_url: '所有页面' }];
//   }
// };

// watch(
//   () => props.projectInfo,
//   () => {
//     getUrls();
//   },
//   { immediate: true }
// );

// 生成水印
function createWatermark() {
  const projectName = boardStore.boardInfoState.project_name || ''
  useWatermark({
    container: document.getElementById('general-board-container') || undefined,
    content: `${props.platformType ? '华佗' : '小松鼠'}-${projectName}-${username}`,
    // rotate默认30度，因此长宽比为1.732:1能最大程度利用空间（容纳最多字符）
    width: '400px',
    height: '300px',
    font: '7.5px Microsoft Yahei Light',
  })
}

const handleStart = () => {
  intro()
    .setOptions({
      steps: [
        {
          title: '提示',
          intro: '您的项目没有任何数据！',
        },
        {
          title: '问题排查',
          element: document.getElementById('faq-icon'),
          intro: '点击此处可以帮助您排查常见问题、查看操作手册.',
        },
      ],
    })
    .start()
}

// const editUrl = () => {
//   console.log('编辑筛选页面');
//   store.dispatch('actSetFilterVisible', true);
// };
</script>
