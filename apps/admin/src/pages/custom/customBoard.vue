<template>
  <div class="p-4 bg-color">
    <div class="grid grid-cols-2 gap-3">
      <div class="chart-container-full">
        <span class="mr-4">看板选择</span>
        <a-select
          v-model:value="boardName"
          placeholder="请选择页面"
          style="min-width: 500px"
          showSearch
          optionFilterProp="label"
        >
          <a-select-option v-for="item of boardList" :label="item" :value="item"> </a-select-option>
        </a-select>
        <a-button type="primary" class="float-right" @click="showModal">新增视图</a-button>
      </div>
      <CunstomCharts />
    </div>
  </div>

  <a-modal v-model:visible="visible" title="新增图表" @ok="handleOk">
    <AddChartForm />
  </a-modal>
</template>

<script setup lang="ts">
//自定义看板页
import { ref } from 'vue'
import CunstomCharts from './component/customCharts.vue'
import AddChartForm from './component/addChartForm.vue'

const boardName = ref('购课监控看板')
const boardList = ref([])

const visible = ref<boolean>(false)

const showModal = () => {
  visible.value = true
}

const handleOk = (e: MouseEvent) => {
  console.log(e)
  visible.value = false
}
</script>
