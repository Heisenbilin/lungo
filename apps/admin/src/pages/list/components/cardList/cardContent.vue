<template>
  <div v-if="loading" class="flex justify-center items-center h-52">
    <a-spin size="large" />
  </div>
  <div v-else-if="!Object.keys(itemsData).length" class="flex justify-center items-center h-52">
    <a-empty :image="simpleImage" />
  </div>
  <div v-else class="flex flex-wrap h-52">
    <ContentItem
      :data="itemsData.pvData"
      title="PV量"
      unit=""
      :needCommafy="true"
      :jumpUrl="getJumpUrl('pageview')"
    />
    <div class="w-2/4 mt-1 px-2">
      <div class="text-gray-500 pl-2">
        {{ filterState.dimension === 'hour' ? '今日' : '本周' }}活跃趋势
      </div>
      <div class="mt-2 content">
        <BasicChart :chartOption="chartOption" height="3.25rem" />
      </div>
    </div>
    <ContentItem
      :data="itemsData.uvData"
      title="UV量"
      unit=""
      :needCommafy="true"
      :jumpUrl="getJumpUrl('pageview')"
    />
    <div class="flex w-full mt-4">
      <a-tooltip color="white" :overlayStyle="{ maxWidth: '400px' }">
        <template #title>
          <div class="text-gray-800">
            分数来源：<br />
            页面加载速度(25%)<br />
            运行时异常率(25%)<br />
            资源异常率(25%)<br />
            请求成功率(25%)
          </div>
        </template>
        <div class="w-1/5 text-center items-center opacity-80">
          <CardProgress :progress="itemsData.score" width="70" radius="3" :hasUnit="false" />
          <div class="text-gray-600 my-1">实时评分</div>
        </div>
      </a-tooltip>
      <ContentItem
        :data="itemsData.pageloadData"
        title="页面加载"
        unit="ms"
        :needCommafy="true"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="getJumpUrl('performance')"
      />
      <ContentItem
        :data="itemsData.runtimeData"
        title="运行时异常率"
        unit="%"
        numName="运行时异常量"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="getJumpUrl('runtime')"
      />
      <ContentItem
        :data="itemsData.resourceData"
        title="资源异常率"
        unit="%"
        numName="资源异常量"
        :reverseColor="true"
        :needGray="true"
        :jumpUrl="getJumpUrl('resource')"
      />
      <ContentItem
        :data="itemsData.ajaxData"
        title="请求成功率"
        unit="%"
        numName="成功请求量"
        :needGray="true"
        :jumpUrl="getJumpUrl('api')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getProjectBoard } from '@/apis/list'
import { CardProgress } from '@vben/components'
import { getTendencyChartOption } from './tendencyChartConfig'
import { BasicChart } from '@vben/components'
import { Empty } from 'ant-design-vue'
import { useBoardStore } from '@/store/modules/board'
import { useListStore } from '@/store/modules/list'
import { storeToRefs } from 'pinia'
import ContentItem from './contentItem.vue'

const boardStore = useBoardStore()
const listStore = useListStore()

const props = defineProps({
  linkToUrl: {
    type: String,
    required: true,
  },
  projectId: {
    type: Number,
    required: true,
  },
})

const loading = ref(true)

const { filterState } = storeToRefs(boardStore)

//数据
const itemsData = ref<any>({})

//今日活跃趋势图表option
const chartOption = computed(() => {
  if (loading.value) return {}
  return getTendencyChartOption(itemsData.value.pvData.pvlist)
})

//获取后台数据
const initCardContentData = async () => {
  loading.value = true
  const params = {
    project_id: props.projectId,
    start_time: listStore.startTime,
    end_time: listStore.endTime,
    time_dimension: filterState.value.dimension === 'hour' ? 'day' : 'week',
  }
  try {
    const result = await getProjectBoard(params)
    if (result.stat === 1) {
      itemsData.value = result.data
    } else {
      itemsData.value = {}
    }
  } finally {
    loading.value = false
  }
}

watch(props, initCardContentData, { immediate: true })

//跳转Url
const getJumpUrl = tabKey => {
  return `${props.linkToUrl}&tabkey=${tabKey}`
}
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>
