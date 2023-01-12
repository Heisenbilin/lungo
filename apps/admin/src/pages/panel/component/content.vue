<template>
  <div id="general-board-container">
    <Charts />
  </div>
  <FAQ />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWatermark } from '@vben/hooks'
import { useBoardDataStore } from '@/store/modules/panel'
import FAQ from '../../component/FAQ.vue'
import Charts from './charts.vue'
import intro from 'intro.js'
import 'intro.js/introjs.css'

const boardDataStore = useBoardDataStore()

//数据看板：管理时间、维度与展示tab
const props = defineProps({
  platformType: {
    type: String,
    default: '',
  },
})

onMounted(() => {
  createWatermark()
})

// 生成水印
function createWatermark() {
  const username = 'xiongbilin'
  const projectName = boardDataStore.boardInfoState.project_name || ''
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
</script>
