<template>
  <div
    class="col-span-9 xl:col-span-5 bg-$component-background-color rounded-lg py-3 px-5 flex justify-between"
  >
    <div>
      <span class="mr-3">
        时间范围
        <a-tooltip :overlayStyle="{ maxWidth: '400px' }" :title="'可选范围：近三周内数据'">
          <InfoCircleOutlined />
        </a-tooltip>
      </span>
      <a-range-picker
        format="YYYY-MM-DD HH:mm"
        :show-time="{ format: 'HH:mm' }"
        :disabledDate="disabledDate"
        v-model:value="filterDate"
        style="width: 340px"
        :ranges="datePickerRanges"
        :locale="locale"
      />
    </div>
    <div>
      <span class="mr-3">展示维度:</span>
      <a-radio-group v-model:value="filterDimension">
        <a-radio-button value="minute">分钟</a-radio-button>
        <a-radio-button value="hour">小时</a-radio-button>
        <a-radio-button value="day">天</a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
// 质量监控页 筛选卡片组件
import { ref, watch } from 'vue'
import { datePickerRanges } from '@/hooks/board/useDate'

import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { useReportStore } from '@/store/modules/report'
import { storeToRefs } from '@vben/stores'

import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)

type RangeValue = [dayjs.Dayjs, dayjs.Dayjs]

const store = useReportStore()
const { filterState: filters } = storeToRefs(store)

//日期纬度: 1 -> 1天; 2 -> 1小时; 3 -> 30分钟
const filterDimension = ref(filters.value.dimension)
watch(filterDimension, val => store.addFilterValue({ dimension: val }))

//初始化时间范围
const initFilterDate = () => {
  // 如果store中存在filter_date参数，直接拿出来赋值
  if (filters.value.start_time && filters.value.end_time) {
    //  debugger
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
  const endTime = dayjs().startOf('day').subtract(-1, 'day')
  const range: RangeValue = [startTime, endTime]
  return range
}

// disalbe近三周以外的日期
const disabledDate = current => {
  // 无法选中的起始日期（21天前）
  const disabledStartTime = dayjs().startOf('day').subtract(21, 'day')
  // 无法选中的终止日期（当前时间整十分）
  const disabledEndTime = dayjs()
  return current < disabledStartTime || current > disabledEndTime
}
//日期范围
const initDate = initFilterDate()
const filterDate = ref<RangeValue>(initDate)
</script>
