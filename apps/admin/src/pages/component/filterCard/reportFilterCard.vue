<template>
  <a-card class="h-full" :bordered="false">
    <div class="flex gap-3 flex-wrap">
      <div>
        <span class="mr-3">周次选择:</span>
        <a-week-picker v-model:value="week" :disabledDate="disabledDate" style="width: 120px" :allowClear="false" />
        <span class="week-picker">
          ({{ `${formatToDate(moment(week).day(1).format())}至${formatToDate(moment(week).day(7).format())}` }})
        </span>
      </div>
    </div>
  </a-card>
</template>

<script setup lang = 'ts'>
// 质量监控页 筛选卡片组件
import { ref, watch, computed } from 'vue';
import { formatToDate } from '@vben/utils';
import { useReportStore } from '@/store/modules/report';
import moment from 'moment';

const reportStore = useReportStore()

const startTime = computed(() => reportStore.getFilterState.start_time);
//周次相关信息
const firstDate = startTime.value; //初始值
const week = ref(firstDate ? moment(firstDate, 'YYYY-MM-DD') : moment().weekday(-7)); //antd通过日期来生成周次
watch(
  week,
  val => {
    const start_time = formatToDate(moment(val).day(1).format());
    const end_time = formatToDate(moment(val).day(7).add(1, 'd').format());
    reportStore.addFilterValue({ start_time, end_time });
  },
  { immediate: true }
);

//disalbe包括当前周以后的周次
const disabledDate = current => {
  let disabledTime = moment().weekday(-1); //无法选中的起始日期（上周日）
  return current > disabledTime;
};
</script>
