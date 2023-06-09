<template>
  <div ref="areaRef" class="p-2 mt-3 mb-8 relative">
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="pageview" :tab="tabNameConfig.pageview">
        <PVBoard v-if="activeKey === 'pageview'" />
      </a-tab-pane>
      <a-tab-pane key="performance" :tab="tabNameConfig.performance">
        <PerformanceBoard v-if="activeKey === 'performance'" />
      </a-tab-pane>
      <a-tab-pane key="runtime" :tab="tabNameConfig.runtime">
        <RuntimeErrorBoard v-if="activeKey === 'runtime'" />
      </a-tab-pane>
      <a-tab-pane key="resource" :tab="tabNameConfig.resource">
        <ResourceErrorBoard v-if="activeKey === 'resource'" />
      </a-tab-pane>
      <a-tab-pane key="api" :tab="tabNameConfig.api">
        <ApiErrorBoard v-if="activeKey === 'api'" />
      </a-tab-pane>
      <a-tab-pane key="gateway" :tab="tabNameConfig.gateway">
        <GatewayBoard v-if="activeKey === 'gateway'" />
      </a-tab-pane>
      <template #rightExtra>
        <a-button
          v-if="activeKey !== 'pageview'"
          size="small"
          class="mr-4"
          @click="() => (uaCollapseState = !uaCollapseState)"
        >
          {{ uaCollapseState ? '收起' : '展开' }}用户信息
        </a-button>
      </template>
    </a-tabs>
  </div>
  <LogDrawer />
  <FAQ />
</template>

<script setup lang="ts">
import { watch, onActivated, onDeactivated, onMounted, ref } from 'vue'
import { useBoardStore } from '@/store/modules/board'
import { useUserStore } from '@/store/user'
import { useWatermark } from '@vben/hooks'
import { tabNameConfig } from '@vben/constants'
import { storeToRefs } from '@vben/stores'

import PVBoard from './pv/index.vue'
import PerformanceBoard from './performance/index.vue'
import RuntimeErrorBoard from './runtime/index.vue'
import ResourceErrorBoard from './resource/index.vue'
import ApiErrorBoard from './apiError/index.vue'
import GatewayBoard from './gateway/index.vue'
import LogDrawer from '../../component/logDetail/logDrawer.vue'
import FAQ from '../../component/FAQ.vue'
// import intro from 'intro.js'
// import 'intro.js/introjs.css'
import { useRouteQuery } from '@vben/router'
import { useAppTheme } from '@vben/hooks'
const { isDark } = useAppTheme()

const boardStore = useBoardStore()
const userStore = useUserStore()
const userName = userStore.userInfo?.account || ''
//tab页key值
const { tabState: activeKey } = storeToRefs(boardStore)

const urlTabkey = useRouteQuery('tabKey', '')
if (!activeKey.value) {
  activeKey.value = tabNameConfig[urlTabkey.value] ? urlTabkey.value : 'pageview'
}

const watchFunc: any[] = []
const initWatch = () => {
  // 监听tabkekey值变化，存入store
  const tabKeyWatch = watch(activeKey, val => boardStore.commitTabState(val), { immediate: true })
  // 监听url中tabkey值变化，改变activeKey
  const urlTabkeyWatch = watch(
    urlTabkey,
    val => {
      if (val && val !== activeKey.value) {
        activeKey.value = tabNameConfig[val] ? val : 'pageview'
      }
    },
    { immediate: true },
  )
  // 监听项目名称、用户名称、tab页、暗黑模式变化，重新生成水印
  const watermarkWatch = watch(
    () => [boardStore.boardInfoState.project_name, activeKey.value, isDark.value],
    () => setWatermark(`${userName}-${boardStore.boardInfoState.project_name}`),
    { immediate: true },
  )
  watchFunc.push(watermarkWatch)
  watchFunc.push(urlTabkeyWatch)
  watchFunc.push(tabKeyWatch)
}

const areaRef = ref<Nullable<HTMLElement>>(null)
const { setWatermark } = useWatermark(areaRef)
onMounted(initWatch)
onActivated(initWatch)
onDeactivated(() => {
  while (watchFunc.length) watchFunc.pop()()
})

const { uaCollapseState } = storeToRefs(boardStore)

// const handleStart = () => {
//   intro()
//     .setOptions({
//       steps: [
//         {
//           title: '提示',
//           intro: '您的项目没有任何数据！',
//         },
//         {
//           title: '问题排查',
//           element: document.getElementById('faq-icon'),
//           intro: '点击此处可以帮助您排查常见问题、查看操作手册.',
//         },
//       ],
//     })
//     .start()
// }
</script>
