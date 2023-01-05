<template>
  <div class="chart-container">
    <div class="chart-title">
      异常资源域名分布
      <a-tooltip
        :overlayStyle="{ maxWidth: '500px' }"
        title="异常资源（接入容错时指：未容错/容错失败资源）的文件url中的域名分布情况"
      >
        <QuestionCircleOutlined />
      </a-tooltip>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="ResourceApis.getErrorHrefData"
      :getOptionFunc="getFaultTolerantOption"
    />
  </div>
  <div class="chart-container" v-if="props.faultTolerantStatus === 'accessed'">
    <div class="chart-title">
      容错成功资源域名分布
      <a-tooltip
        :overlayStyle="{ maxWidth: '500px' }"
        title="容错成功资源的文件url中的域名分布情况"
      >
        <QuestionCircleOutlined />
      </a-tooltip>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="ResourceApis.getFErrorData"
      :getOptionFunc="getFaultTolerantOption"
    />
  </div>
  <div class="chart-container" v-if="props.faultTolerantStatus === 'accessed'">
    <div class="chart-title">
      容错次数
      <a-tooltip :overlayStyle="{ maxWidth: '500px' }" title="容错成功历经的容错次数">
        <QuestionCircleOutlined />
      </a-tooltip>
      <a-tag color="green" class="filter-tag"> 双击查看日志 </a-tag>
    </div>
    <BaseChart
      :requestParams="requestParams"
      :requestFunc="ResourceApis.getFTimesData"
      :bindFuncs="{ dblclick: openLog }"
      :getOptionFunc="getFaultTolerantTimesOption"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ResourceApis } from '/@/api/board/resource';
import { getFaultTolerantOption, getFaultTolerantTimesOption } from '../../../util/pieChartConfig';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { logTypeEnum } from '/@/enums/boardEnum';
import { boardStore } from '/@/store/modules/board';
import BaseChart from '/@/components/coreBoard/baseChart.vue';

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.getBoardInfoState.id}`, //项目id
  start_time: boardStore.getFilterState.start_time, //开始时间
  end_time: boardStore.getFilterState.end_time, //结束时间
  url: boardStore.getFilterState.url, //路由筛选
  browser: boardStore.getFilterState.browser, //浏览器筛选
  device: boardStore.getFilterState.device, //设备筛选
  region: boardStore.getFilterState.region, //地区筛选
  network: boardStore.getFilterState.network, //网络类型筛选
  client: boardStore.getFilterState.client, //客户端筛选
  os: boardStore.getFilterState.os, //操作系统筛选
  resource_type: boardStore.getFilterState.resource_type, //资源类型筛选
}));

// api异常详情相关饼图组件
const props = defineProps({
  faultTolerantStatus: {
    type: String,
    required: true,
  },
});

// 打开日志详情
const openLog = title => {
  const times = title.data.name.split('次')[0];
  boardStore.openLogInfoState({
    type: logTypeEnum.FAULTTOLERANT,
    visible: true,
    requestParams: {
      fault_tolerant_count: times,
    },
  });
};
</script>
