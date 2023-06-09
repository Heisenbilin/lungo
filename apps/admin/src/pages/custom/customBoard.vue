<template>
  <div class="p-4 bg-color mb-10">
    <div class="grid grid-cols-9 gap-x-8 gap-y-2">
      <div class="col-span-7 xl:col-span-3 bg-$component-background-color rounded-lg py-3 px-5">
        <span class="mr-4">看板选择</span>
        <a-select
          v-model:value="boardName"
          placeholder="请选择页面"
          style="min-width: 250px"
          showSearch
          optionFilterProp="label"
        >
          <a-select-option v-for="item of boardList" :label="item" :value="item"> </a-select-option>
        </a-select>
      </div>
      <div class="col-span-2 xl:col-span-1 flex-center flex xl:hidden">
        <a-button class="float-right" @click="showModal">新增视图</a-button>
      </div>
      <CustomFilterCard />
      <div class="col-span-2 xl:col-span-1 flex-center hidden xl:flex">
        <a-button class="float-right" @click="showModal">新增视图</a-button>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-4">
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
import CustomFilterCard from '@/pages/component/filterCard/customFilterCard.vue'

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
