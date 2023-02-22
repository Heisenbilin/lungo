<template>
  <div id="general-panel-container" ref="areaRef" class="relative">
    <Charts />
  </div>
  <FAQ />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onActivated, onDeactivated } from 'vue'
import { useWatermark } from '@vben/hooks'
import { usePanelStore } from '@/store/modules/panel'
import FAQ from '@/pages/component/FAQ.vue'
import Charts from './charts.vue'
// import intro from 'intro.js'
// import 'intro.js/introjs.css'

const panelStore = usePanelStore()
const userName = 'xiongbilin'

const watchFunc: any[] = []
const initWatch = () => {
  // 从其他页面返回时，重新生成水印
  const watermarkWatch = watch(
    () => [panelStore.boardInfoState.project_name, userName],
    () => setWatermark(`${userName}-${panelStore.boardInfoState.project_name}`),
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
