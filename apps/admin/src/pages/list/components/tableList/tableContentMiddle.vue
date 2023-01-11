<template>
  <div>
    <div v-if="title == 'pv'">
      <TableTtem
        :data="itemsData.pvData"
        title="PV量"
        unit=""
        :needCommafy="true"
        :jumpUrl="getJumpUrl('basic')"
      />
    </div>
    <div v-else-if="title == 'uv'">
      <TableTtem
        :data="itemsData.uvData"
        title="UV量"
        unit=""
        :needCommafy="true"
        :jumpUrl="getJumpUrl('basic')"
      />
    </div>
    <div v-else-if="title == '页面加载'">
      <TableTtem
        :data="itemsData.pageloadData"
        title="页面加载"
        unit="ms"
        :needCommafy="true"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="getJumpUrl('performance')"
      />
    </div>
    <div v-else-if="title == '运行时异常率'">
      <TableTtem
        :data="itemsData.runtimeData"
        title="运行时异常率"
        unit="%"
        numName="运行时异常量"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="getJumpUrl('runtime')"
      />
    </div>
    <div v-else-if="title == '资源异常率'">
      <TableTtem
        :data="itemsData.resourceData"
        title="资源异常率"
        unit="%"
        numName="资源异常量"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="getJumpUrl('resource')"
      />
    </div>
    <div v-else-if="title == '请求成功率'">
      <TableTtem
        :data="itemsData.ajaxData"
        title="请求成功率"
        unit="%"
        numName="成功请求量"
        :needGray="true"
        :jumpUrl="getJumpUrl('api')"
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
})

//跳转Url
const getJumpUrl = tabKey => {
  return `${props.linkToUrl}&tabkey=${tabKey}`
}
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
