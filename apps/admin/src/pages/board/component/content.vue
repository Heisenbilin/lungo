<template>
  <div id="general-board-container" ref="areaRef" class="p-2 mt-3 relative">
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="pageview" tab="页面访问">
        <PVBoard v-if="activeKey === 'pageview'" />
      </a-tab-pane>
      <a-tab-pane key="performance" tab="性能指标">
        <PerformanceBoard v-if="activeKey === 'performance'" />
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
import { watch, onActivated, onDeactivated, onMounted, ref } from 'vue'
import { getUrlParams, addOrUpdateUrlParams } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { useUserStore } from '@/store/user'
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

const boardStore = useBoardStore()
const userStore = useUserStore()
const userName = userStore.userInfo?.account || ''

//tab页key值
const { tabState: activeKey } = storeToRefs(boardStore)
if (!activeKey.value) {
  // store中没有值，从url中获取
  const { tabkey } = getUrlParams()
  activeKey.value = tabListEnum[tabkey] ? tabkey : 'pageview'
}
watch(activeKey, val => addOrUpdateUrlParams({ tabkey: val }), {
  immediate: true,
})

const watchFunc: any[] = []
const initWatch = () => {
  // 从其他页面返回时，重新生成水印
  const watermarkWatch = watch(
    () => [boardStore.boardInfoState.project_name, userName],
    () => setWatermark(`${userName}-${boardStore.boardInfoState.project_name}`),
    { immediate: true },
  )
  watchFunc.push(watermarkWatch)
}

const areaRef = ref<Nullable<HTMLElement>>(null)
const { setWatermark } = useWatermark(areaRef)

onMounted(initWatch)
onActivated(initWatch)
onDeactivated(() => {
  while (watchFunc.length) watchFunc.pop()()
})

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
</script>
