<template>
  <div class="stability-title">
    <h1>四、项目稳定性指标</h1>
    <div class="access-status float-right text-base l">
      <project-access-status />
    </div>
  </div>
  <div class="project-stability my-5 clear-both">
    <a-row>
      <div class="w-full xl:w-1/2 p-4">
        <div class="chart-title">
          运行时异常（总异常量:
          <span class="text-red-500"> {{ runtimeTotal }} </span>）
        </div>
        <BaseChart
          :requestParams="chartDataRequestParams"
          :requestFunc="
            params => reportApis.getTwoWeeksSummary({ ...params, board_type: 'runtime' })
          "
          :getOptionFunc="data => getTwoWeeksOption(data, 'runtime')"
          height="360px"
        />
      </div>
      <div class="w-full xl:w-1/2 p-4">
        <div class="chart-title">
          资源异常（总异常量:
          <span class="text-red-500"> {{ resourceTotal }} </span>）
        </div>
        <BaseChart
          :requestParams="chartDataRequestParams"
          :requestFunc="
            params => reportApis.getTwoWeeksSummary({ ...params, board_type: 'resource' })
          "
          :getOptionFunc="data => getTwoWeeksOption(data, 'resource')"
          height="360px"
        />
      </div>

      <div class="w-full xl:w-1/2 p-4">
        <div class="chart-title">运行时异常Top10</div>
        <BaseChart
          :requestParams="errorChartDataRequestParams"
          :bindFuncs="{
            click: title => openRuntimeLogDrawer(title.data.name, 'content'),
          }"
          :requestFunc="
            params => {
              params.filter.boardType = 'runtimeTop';
              return litSquirrelApi.boardTaskInfo.getBoardData(params);
            }
          "
          :getOptionFunc="getTop10Option"
        />
      </div>

      <div class="w-full xl:w-1/2 p-4">
        <div class="chart-title">运行时异常Top10 URL</div>
        <BaseChart
          :requestParams="chartDataRequestParams"
          :bindFuncs="{
            click: title => openRuntimeLogDrawer(title.data.name, 'domain'),
          }"
          :requestFunc="params => reportApis.getErrorSummary({ ...params, board_type: 'runtime' })"
          :getOptionFunc="data => getTop10UrlOption(data, 'runtime')"
        />
      </div>

      <div class="w-full xl:w-1/2 p-4">
        <div class="chart-title">资源异常Top10</div>
        <BaseChart
          :requestParams="errorChartDataRequestParams"
          :bindFuncs="{
            click: title => openResourceLogDrawer(title.data.name, 'href')
          }"
          :requestFunc="
            params => {
              params.filter.boardType = 'resourceTop';
              return litSquirrelApi.boardTaskInfo.getBoardData(params);
            }
          "
          :getOptionFunc="getTop10Option"
        />
      </div>

      <div class="w-full xl:w-1/2 p-4">
        <div class="chart-title">资源异常Top10 URL</div>
        <BaseChart
          :requestParams="chartDataRequestParams"
          :bindFuncs="{
            click: title => openResourceLogDrawer(title.data.name, 'domain'),
          }"
          :requestFunc="params => reportApis.getErrorSummary({ ...params, board_type: 'resource' })"
          :getOptionFunc="data => getTop10UrlOption(data, 'resource')"
        />
      </div>

      <div class="w-full xl:w-1/2 p-4">
        <div class="chart-title">接口异常Top10</div>
        <BaseChart
          :requestParams="chartDataRequestParams"
          :bindFuncs="{ click: openApiTop10Log }"
          :requestFunc="ApiErrorApis.getTop10Data"
          :getOptionFunc="getTop10Option"
        />
      </div>
      <div class="w-full xl:w-1/2 p-4">
        <div class="chart-title">接口耗时统计</div>
        <BaseChart
          :requestParams="chartDataRequestParams"
          :bindFuncs="{ click: openApiCostTimeLog }"
          :requestFunc="ApiErrorApis.getCostTimeData"
          :getOptionFunc="getCostTimeChartOption"
        />
      </div>
      <LogDrawer boardType="report" />
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import * as ApiErrorApis from '@/apis/board/apiError';
import { reportApis } from '@/apis/report';
import { litSquirrelApi } from '@/apis/litSquirrel';
import { getTwoWeeksOption } from '../utils/configs';
import {
  getCostTimeChartOption,
  getTop10Option,
  getTop10UrlOption,
} from '@/pages/board/component/util/pieChartConfig';
import { commafy } from '@vben/utils';
import { logTypeEnum } from '@vben/constants';
import projectAccessStatus from './projectAccessStatus.vue';
// import LogDrawer from '/@/components/boardNew/component/logDetail/logDrawer.vue';
import {BaseChart} from '@vben/components';
import { useReportStore } from '@/store/modules/report';
import { storeToRefs } from 'pinia'

const boardStore = useReportStore()

// const { boardInfoState } = storeToRefs(boardStore)
// @ts-ignore
// TODO: 临时解决方案
// const { account: userid = '' } = store.state.userInfo;
const userid = "xiongbilin";
const resourceTotal = ref('');
const runtimeTotal = ref('');

const chartDataRequestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`,
  start_time: boardStore.filterState.start_time,
  end_time: boardStore.filterState.end_time,
}));

const errorChartDataRequestParams = computed(() => ({
  boardid: '0x000',
  filter: {
    gteTime: boardStore.filterState.start_time,
    lteTime: boardStore.filterState.end_time,
  },
  projectid: `${boardStore.boardInfoState.id}`,
  userid: userid,
}));
//后台数据获取与处理
async function initData() {
  //异常总数 数据获取与处理
  let result = await reportApis.getErrorTotalSummary(chartDataRequestParams.value);
  if (result.stat === 1 && Object.keys(result.data).length) {
    resourceTotal.value = commafy(result.data.resourceTotal);
    runtimeTotal.value = commafy(result.data.runtimeTotal);
  } else {
    resourceTotal.value = runtimeTotal.value = '';
  }
}

watch(() => chartDataRequestParams, initData, { immediate: true });

/*
 *  LogDrawer
 */

// 打开runtime异常抽屉
const openRuntimeLogDrawer = (error_content, error_type) => {
  boardStore.openLogInfoState({
    type: logTypeEnum.RUNTIME,
    visible: true,
    requestParams: { error_content, error_type },
  });
};

// 打开runtime异常抽屉
const openResourceLogDrawer = (err_content, error_type) => {
  boardStore.openLogInfoState({
    type: logTypeEnum.RESOURCE,
    visible: true,
    requestParams: { error_type, err_content },
  });
};

// 打开API异常 CostTime 抽屉
const openApiCostTimeLog = title => {
  const [from, to] = title.data.name.split(' to ');
  boardStore.openLogInfoState({
    type: logTypeEnum.API,
    visible: true,
    requestParams: { range_start: from, range_end: to },
  });
};
// 打开API异常 top10 抽屉
const openApiTop10Log = title => {
  boardStore.openLogInfoState({
    type: logTypeEnum.API,
    visible: true,
    requestParams: { request_url: title.data.name, response_type: 'fail' },
  });
};
</script>

<style lang="scss" scoped>
.stability-title {
  > h1 {
    font-size: 24px;
    float: left;
  }
  .access-status {
    float: right;
    font-size: 16px;
    line-height: 40px;
  }
}
</style>
