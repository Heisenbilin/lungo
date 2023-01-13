<template>
  <div>
    <div v-if="title == 'pv'">
      <TableTtem
        :project="project"
        :data="itemsData.pvData"
        title="PV量"
        unit=""
        :needCommafy="true"
        :jumpUrl="linkToUrl"
        tabKey="pageview"
      />
    </div>
    <div v-else-if="title == 'uv'">
      <TableTtem
        :project="project"
        :data="itemsData.uvData"
        title="UV量"
        unit=""
        :needCommafy="true"
        :jumpUrl="linkToUrl"
        tabKey="pageview"
      />
    </div>
    <div v-else-if="title == '页面加载'">
      <TableTtem
        :project="project"
        :data="itemsData.pageloadData"
        title="页面加载"
        unit="ms"
        :needCommafy="true"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="linkToUrl"
        tabKey="performance"
      />
    </div>
    <div v-else-if="title == '运行时异常率'">
      <TableTtem
        :project="project"
        :data="itemsData.runtimeData"
        title="运行时异常率"
        unit="%"
        numName="运行时异常量"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="linkToUrl"
        tabKey="runtime"
      />
    </div>
    <div v-else-if="title == '资源异常率'">
      <TableTtem
        :project="project"
        :data="itemsData.resourceData"
        title="资源异常率"
        unit="%"
        numName="资源异常量"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="linkToUrl"
        tabKey="resource"
      />
    </div>
    <div v-else-if="title == '请求成功率'">
      <TableTtem
        :project="project"
        :data="itemsData.ajaxData"
        title="请求成功率"
        unit="%"
        numName="成功请求量"
        :needGray="true"
        :jumpUrl="linkToUrl"
        tabKey="api"
      />
    </div>
    <div
      v-else-if="title == '分数'"
      class="text-gray-600 my-1 center text-1xl"
      :style="{
        color: barFinColor(itemsData.score),
        fontSize: '1.5rem',
        fontWeight: 'bold',
      }"
    >
      {{ itemsData.score }}
    </div>
    <!-- <div v-else-if="title == '页面加载'">
      <TableTtem
        :data="itemsData.pageloadData"
        title="页面加载"
        unit="ms"
        :needCommafy="true"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="getJumpUrl('performance')"
      />
    </div> -->
    <div v-else>
      <BasicChart :chartOption="chartOption" height="3.25rem" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getTendencyChartOption } from '../utils'
import { BasicChart } from '@vben/components'
import TableTtem from './tableItem.vue'
import { BoardInfo } from '@vben/types'

const props = defineProps({
  linkToUrl: {
    type: String,
    required: true,
  },
  title: String,
  itemsData: {
    type: Object,
    required: true,
  },
  project: {
    type: Object as PropType<BoardInfo>,
    required: true,
  },
})

// const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

//今日活跃趋势图表option
const chartOption = computed(() => {
  return getTendencyChartOption(props.itemsData.pvData.pvlist)
})
//设置分数的颜色样式
const barFinColor = num => {
  if (num < 50) {
    return '#ec5c4c'
  }
  if (49 < num && num < 75) {
    return '#F2AE57'
  }
  if (74 < num) {
    return '#5eca75'
  }
}
</script>
