<template>
  <a-card class="h-full" :bordered="false">
    <div class="flex gap-3 flex-wrap">
      <div>
        <span class="mr-3">周次选择:</span>
        <a-date-picker
          picker="week"
          :format="`${week.year()}年 第${week.week()}周`"
          v-model:value="week"
          :disabledDate="disabledDate"
          style="width: 150px"
          :allowClear="false"
        />
        <span class="week-picker">
          ({{
            `${formatToDate(dayjs(week).day(1).format())}至${formatToDate(
              dayjs(week).day(7).format(),
            )}`
          }})
        </span>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
// 质量监控页 筛选卡片组件
import { ref, watch } from 'vue'
import { formatToDate } from '@vben/utils'
import { useReportStore } from '@/store/modules/report'
import { storeToRefs } from '@vben/stores'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)

const reportStore = useReportStore()
const { filterState: filters } = storeToRefs(reportStore)

//周次相关信息
const startTime = dayjs(filters.value.start_time, 'YYYY-MM-DD')
const initDate = startTime.isValid() ? startTime : dayjs().day(-13) //初始值
const week = ref<dayjs.Dayjs>(initDate)

watch(
  week,
  val => {
    const start_time = val?.day(1).format('YYYY-MM-DD')
    const end_time = val?.day(7).add(1, 'd').format('YYYY-MM-DD')
    if (start_time !== filters.value.start_time || end_time !== filters.value.end_time) {
      reportStore.addFilterValue({ start_time, end_time })
    }
  },
  { immediate: true },
)

//disalbe包括当前周以后的周次
const disabledDate = current => {
  let disabledTime = dayjs().day(-5) //无法选中的起始日期（上周日）
  return current > disabledTime
}
</script>
