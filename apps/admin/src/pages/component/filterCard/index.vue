<template>
  <a-card class="h-full" :bordered="false">
    <template #title>
      <div class="flex h-7 mr-4 items-center justify-between">
        筛选条件
        <a-tooltip title="清空筛选条件">
          <ClearOutlined class="float-right" @click="clearFilter" />
        </a-tooltip>
      </div>
    </template>
    <div class="flex gap-3 flex-wrap">
      <div>
        <span class="mr-3">
          时间范围
          <a-tooltip
            :overlayStyle="{ maxWidth: '400px' }"
            :title="
              props.boardType === 'general'
                ? '可选范围：近三周内数据'
                : '本看板数据范围：接入本平台后数据永久保存'
            "
          >
            <a href="https://cloud.tal.com/gateway-fe#/config/upstreamList" target="_blank">
              <InfoCircleOutlined />
            </a>
          </a-tooltip>
        </span>
        <a-range-picker
          format="YYYY-MM-DD HH:mm"
          :show-time="{ format: 'HH:mm', minuteStep: 10 }"
          :disabledDate="props.boardType === 'general' ? disabledDate : null"
          v-model:value="filterDate"
          style="width: 340px"
          :ranges="datePickerRanges"
        />
      </div>
      <div>
        <span class="mr-3">展示维度:</span>
        <a-radio-group v-model:value="filterDimension">
          <a-radio-button value="day">1天</a-radio-button>
          <a-radio-button value="hour">1小时</a-radio-button>
          <a-radio-button value="halfHour">30分钟</a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap mt-3">
      <template v-for="(value, key) in filters" :key="key">
        <template v-if="!excludeFilters.includes(key)">
          <FilterTag
            :active="(tabActiveFilters[tabState] || []).includes(key)"
            :name="key"
            :title="
              key === 'performance_key' ? filters.performance_key + '耗时' : filterTitleConfig[key]
            "
            :content="
  key === 'api_range'
    ? filters.api_range!.join(' - ') + ' ms'
    : key === 'performance_key'
      ? filters.performance_range!.join(' - ') + ' ms'
      : key === 'client'
        ? clientUserAgent[filters.client!] || '未知'
        : value
            "
          />
        </template>
      </template>
    </div>
  </a-card>
</template>

<script setup lang="ts">
// 质量监控页 筛选卡片组件
import { ref, watch } from 'vue'
import { getUrlParams, formatDateString } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { useBoardDataStore } from '@/store/modules/panel'
import { InfoCircleOutlined, ClearOutlined } from '@ant-design/icons-vue'
import { clientUserAgent } from '@vben/constants'
import { datePickerRanges } from '@/hooks/board/useDate'
import { filterTitleConfig, tabActiveFilters, excludeFilters } from '@vben/constants'
import { storeToRefs } from 'pinia'
import FilterTag from './filterTag.vue'
import dayjs from 'dayjs'
type RangeValue = [dayjs.Dayjs, dayjs.Dayjs]

const boardStore = useBoardStore()
const boardDataStore = useBoardDataStore()

const type = 'YY-MM-DD HH-mm-ss'
const props = defineProps({
  boardType: {
    type: String,
    default: 'general',
  },
})

const store = props.boardType === 'general' ? boardStore : boardDataStore

// 初始筛选条件
const urlParams = getUrlParams()
Object.keys(urlParams).forEach(key => {
  if (!tabActiveFilters.pageview.includes(key)) {
    delete urlParams[key]
  }
})

store.addFilterValue(urlParams)

const { filterState: filters } = storeToRefs(store)
const { tabState } = storeToRefs(store)

//日期纬度: 1 -> 1天; 2 -> 1小时; 3 -> 30分钟
const filterDimension = ref(filters.value.dimension)
watch(filterDimension, val => store.addFilterValue({ dimension: val }), { immediate: true })

//初始化时间范围
const initFilterDate = () => {
  // 如果store中存在filter_date参数，直接拿出来赋值
  if (filters.value.start_time && filters.value.end_time) {
    const startTime = dayjs(filters.value.start_time)
    const endTime = dayjs(filters.value.end_time)
    if (startTime.isValid() && endTime.isValid()) {
      const range: RangeValue = [startTime, endTime]
      return range
    }
  }
  const startTime =
    filterDimension.value === 'day'
      ? dayjs().startOf('day').subtract(6, 'd')
      : dayjs().startOf('day')
  const endTime = dayjs()
    .minute(10 * Math.floor(dayjs().minute() / 10))
    .second(0)
  const range: RangeValue = [startTime, endTime]
  console.log(range)
  return range
}

//日期范围
const initDate = initFilterDate()
const filterDate = ref<RangeValue>(initDate)

watch(
  () => [store.filterState.start_time, store.filterState.end_time],
  val => {
    if (val[0] && val[1]) filterDate.value = [dayjs(val[0]), dayjs(val[1])]
  },
)

//处理时间范围变化
watch(
  filterDate,
  val => {
    console.log(JSON.stringify(val))
    const [gteTime, lteTime] = val
    //把当前选择的时间转换为API规范的时间
    const start_time = formatDateString(gteTime.valueOf(), type)
    const end_time = formatDateString(lteTime.valueOf(), type)
    console.log(start_time, end_time)
    if (start_time !== filters.value.start_time || end_time !== filters.value.end_time) {
      store.addFilterValue({ start_time, end_time })
    }
  },
  { immediate: true },
)

// disalbe包括当前周以后的周次
const disabledDate = current => {
  // 无法选中的起始日期（21天前）
  const disabledStartTime = dayjs().startOf('day').subtract(21, 'day')
  // 无法选中的终止日期（当前时间整十分）
  const disabledEndTime = dayjs()
  return current < disabledStartTime || current > disabledEndTime
}

// 清除所有筛选条件
const clearFilter = () => {
  //把当前选择的时间转换为API规范的时间
  const start_time = formatDateString(dayjs().startOf('day').subtract(6, 'd').valueOf(), type)
  const end_time = formatDateString(
    dayjs()
      .minute(10 * Math.floor(dayjs().minute() / 10))
      .second(0)
      .valueOf(),
    type,
  )
  store.commitFilterState({ start_time, end_time, dimension: 'day' })
  filterDimension.value = 'day'
}
</script>
