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
          :locale="locale"
        />
        <span class="week-picker">
          ({{
            `${formatToDate(dayjs(week).day(1).format())}至${formatToDate(
              dayjs(week).day(7).format(),
            )}`
          }})
        </span>
      </div>
      <div>
        <div class="flex gap-3 flex-wrap">
          <span class="mr-3">功能接入:</span>
          <accessTag
            v-if="sourcemapStatus !== 'noData'"
            :access="sourcemapStatus === 'access'"
            name="sourcemap"
          />
          <accessTag v-if="cdnStatus !== 'noData'" :access="cdnStatus === 'access'" name="cdn" />
          <accessTag
            v-if="resourceStatus !== 'noData'"
            :access="resourceStatus === 'access'"
            name="resource"
          />
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
// 质量监控页 筛选卡片组件
import { computed, ref, watch } from 'vue'
import { checkResourceStatus, checkCDNStatus } from '@/apis/report/apis'

import { formatToDate } from '@vben/utils'
import { useReportStore } from '@/store/modules/report'
import { storeToRefs } from '@vben/stores'
import accessTag from './accessTag.vue'

import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
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

//根据项目列表中sourcemap_analysis字段的值判定是否接入sourcemap
const sourcemapStatus = computed(() => {
  switch (reportStore.boardInfoState.sourcemap_analysis) {
    case 0:
      return 'notAccess'
    case 1:
      return 'access'
    default:
      return 'noData'
  }
})

const cdnStatus = ref('noData')
const resourceStatus = ref('noData')

//检查容错是否接入
async function checkResource() {
  resourceStatus.value = 'noData'
  const resourceResult = await checkResourceStatus(params.value)
  if (resourceResult?.stat === 1) {
    resourceStatus.value = resourceResult.data.resourceResult === true ? 'access' : 'notAccess'
  }
}

//检查cdn是否接入
async function checkCDN() {
  cdnStatus.value = 'noData'
  const cdnResult = await checkCDNStatus(params.value)
  if (cdnResult?.stat === 1) {
    cdnStatus.value = cdnResult.data.cdnResult === true ? 'access' : 'notAccess'
  }
}

const params = computed(() => ({
  project_id: `${reportStore.boardInfoState.id}`,
  start_time: reportStore.filterState.start_time,
  end_time: reportStore.filterState.end_time,
}))

function initData() {
  //异步check 容错接入
  checkResource()
  //异步check CDN接入
  checkCDN()
}

watch(() => params, initData, { immediate: true, deep: true })
</script>
