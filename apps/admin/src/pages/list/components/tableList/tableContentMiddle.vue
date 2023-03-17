<template>
  <div>
    <div v-if="title == 'pv'">
      <TableTtem
        :project="project"
        :data="itemsData.pvData"
        title="PV量"
        unit=""
        :needCommafy="true"
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
        tabKey="api"
      />
    </div>
    <div
      v-else-if="title == '分数'"
      class="my-1 center text- text-2xl font-bold outline-solid-red-700"
      :style="{ color: barFinColor(itemsData.score) }"
    >
      <a-tooltip :overlayStyle="{ maxWidth: '600px' }">
        <template #title>
          评分规则：以下四项评分和除以4
          <a-table
            :columns="scoreColumns"
            :data-source="scoreData"
            size="small"
            :pagination="false"
          />
        </template>
        {{ itemsData.score }}
      </a-tooltip>
    </div>
    <div v-else>
      <BasicChart :chartOption="chartOption" height="3.25rem" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { scoreColumns, scoreData, barFinColor } from '../utils'
import { getTendencyChartOption } from '../tendencyChartConfig'
import { BasicChart } from '@vben/components'
import TableTtem from './tableItem.vue'
import { BoardInfo } from '@vben/types'

const props = defineProps({
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

//今日活跃趋势图表option
const chartOption = computed(() => {
  return getTendencyChartOption(props.itemsData.pvData.pvlist)
})
</script>
