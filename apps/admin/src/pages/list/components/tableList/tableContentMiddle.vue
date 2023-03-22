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
          <div class="mb-1">评分规则：以下四项评分均值</div>
          <a-table
            :columns="scoreColumns"
            :data-source="scoreDataList"
            size="small"
            :pagination="false"
          >
            <template #bodyCell="{ column, text }">
              <template v-if="column.key === 'name'">
                <router-link class="grid justify-items-center center w-full" :to="linkUrl(text)">
                  <div @click="() => useStoreProject(project, 'board')">{{ text }}</div>
                </router-link>
              </template>
              <template v-if="column.key === 'score'">
                <div :style="{ color: barFinColor(text) }">{{ text }}</div>
              </template>
            </template>
          </a-table>
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
import { useLinkToUrl, useStoreProject } from '@/hooks/board/useLink'
import { BasicChart } from '@vben/components'
import { BoardInfo } from '@vben/types'
import { cloneDeep } from '@vben/utils'
import TableTtem from './tableItem.vue'

const props = defineProps({
  title: String,
  itemsData: { type: Object, required: true },
  project: { type: Object as PropType<BoardInfo>, required: true },
})

// 得分数据
const scoreDataList = computed(() => {
  const dataList = cloneDeep(scoreData)
  if (Object.keys(props.itemsData).length === 0) return dataList
  dataList[0].score = props.itemsData.runtimeData?.score ?? ''
  dataList[1].score = props.itemsData.resourceData?.score ?? ''
  dataList[2].score = props.itemsData.ajaxData?.score ?? ''
  dataList[3].score = props.itemsData.pageloadData?.score ?? ''
  return dataList
})

//今日活跃趋势图表option
const chartOption = computed(() => getTendencyChartOption(props.itemsData.pvData.pvlist))

const linkUrl = text => {
  const tabKey =
    text === '页面加载'
      ? 'performance'
      : text === '运行时异常率'
      ? 'runtime'
      : text === '资源异常率'
      ? 'resource'
      : text === '请求成功率'
      ? 'api'
      : ''
  return useLinkToUrl(props.project.id, 'board', 'list', tabKey)
}
</script>
