<template>
  <div class="stability">
    <a-row>
      <a-col :span="16">
        <div class="first-title">二、稳定性</div>
        <div id="stability-description" class="content-text">
          <a-spin size="large" class="loading" v-if="loading.auditsLoading === 0" />
          <span v-else-if="loading.auditsLoading === 1">
            稳定性评分主要考量Runtime 异常率、Resource 异常率以及白屏率三个指标分数<br />
            三个指标进行加权计算所得的分数作为稳定性评分，分数越高稳定性也越好<br />
            稳定性不足的位置会着重报告，需要开发人员进行进一步优化
          </span>
          <link-text v-else :text="preparedLighthouse.description" />
        </div>
      </a-col>
      <a-col :span="8">
        <circle-progress ref="$circle" class="progress" key="duration-model" :progress="stabilityScore" />
      </a-col>
    </a-row>

    <div class="runtime-container">
      <div class="second-title">2.1 Runtime异常率({{ runtimeRate }})</div>
      <a-spin size="large" class="loading" v-if="loading.runtimeLoading === 0" />
      <a-empty v-else-if="loading.runtimeLoading === 1" class="empty" :image="simpleImage" />
      <chart v-else chartName="runtime-main" class="avg-main" :option="runtimeErrorOption" />
      <div>
        <span class="rule"> 计算规则：Runtime / PV </span> <span class="rule">权重：33%</span>
        <div class="rule">
          分值计算：
          <span class="top">0~1% 75~100分</span>
          <span class="mid">1~3% 50~75分</span>
          <span class="bot">3%以上 0~50分</span>
        </div>
      </div>
    </div>

    <div class="resource-container">
      <div class="second-title">2.2 Resource异常率({{ resourceRate }})</div>
      <a-spin size="large" class="loading" v-if="loading.runtimeLoading === 0" />
      <a-empty v-else-if="loading.runtimeLoading === 1" :image="simpleImage" />
      <chart v-else chartName="resource-main" class="avg-main" :option="resourceErrorOption" />
      <div>
        <span class="rule">计算规则：Resource / PV</span><span class="rule">权重：34%</span>
        <div class="rule">
          分值计算：<span class="top">0~1% 75~100分</span><span class="mid">1~3% 50~75分</span><span class="bot">3%以上
            0~50分</span>
        </div>
      </div>
    </div>

    <div class="resource-container">
      <div class="second-title">2.3 白屏率-服务端({{ whiteRate }})</div>
      <h3 class="error-text" v-if="noWhite">
        --无法统计(项目未接入白屏，
        <a href="http://app.xesv5.com/fanghuo" target="_blank"> 点击接入 </a>)--
      </h3>
      <div>
        <span class="rule">计算规则：白屏次数 / 检测次数</span><span class="rule">权重：33%</span>
        <div class="rule">
          分值计算：<span class="top">0~1% 75~100分</span><span class="mid">1~3% 50~75分</span><span class="bot">3%以上
            0~50分</span>
        </div>
      </div>
    </div>

    <div class="second-title">2.4 稳定性优化建议</div>
    <a-spin size="large" class="loading" v-if="loading.auditsLoading === 0" />
    <a-empty v-else-if="loading.auditsLoading === 1" :image="simpleImage" />
    <template v-else v-for="[clumpId, auditRefs] of stabilityAudits" :key="clumpId">
      <audit-layout v-if="clumpId !== 'NotAGroup'" :audits="auditRefs" :group="groups[clumpId]" />
    </template>
    <a-divider style="background-color: #555" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Empty } from 'ant-design-vue';
import CircleProgress from '@vben/components/src/chart/circleProgress.vue';
// import * as echarts from 'echarts';
import { getErrSummary, getWhiteRate } from '@/apis/report/apis';
import { getStabilityAudits } from './util';
import { getScore, getUrlErrorOptions } from './config';
// import { message } from 'ant-design-vue';
import chart from './chart.vue';
import linkText from './linkText.vue';
import AuditLayout from './audit/auditLayout.vue';

//页面质量周报稳定性组件
type Props = {
  preparedLighthouse: any;
  groups: any;
  lighthouseLoading: number;
};
const props = defineProps<Props>();
const route = useRoute();
const stabilityScore: any = ref(0);
const runtimeScore: any = ref(0);
const resourceScore: any = ref(0);
const whiteScore: any = ref(0);
const runtimeData = ref([]);
const runtimeRate: any = ref(0);
const resourceData = ref([]);
const resourceRate = ref(0);
const whiteRate = ref(0);
const noWhite = ref(false);
// const performanceScore = ref(0);
const runtimeErrorOption = ref({});
const resourceErrorOption = ref({});

const loading = ref({
  runtimeLoading: 0,
  resourceLoading: 0,
  whiteLoading: 0,
  auditsLoading: 0,
});
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);

const stabilityAudits: any = ref([]);
type Emits = {(e:'stabilityScoreChange',score: number):void; }
const emit = defineEmits<Emits>();
onMounted(() => {
  initData();
});

//监听父组件lighthouse数据加载标识，解析lighthouse数据
watch(
  () => props.lighthouseLoading,
  () => {
    if (props.lighthouseLoading === 2) {
      stabilityAudits.value = getStabilityAudits(props.preparedLighthouse);
      loading.value.auditsLoading = 2;
    } else {
      loading.value.auditsLoading = props.lighthouseLoading;
    }
  }
);

async function initData() {
  const { start_time, end_time, project_id, url: board_url } = route.query;
  const params = {
    start_time,
    end_time,
    project_id,
    board_url: decodeURIComponent(board_url as string),
    board_type: 'runtime,resource',
  };
  await initWhite(params);

  //获取resource&runtime异常的总数统计
  const result = await getErrSummary(params);
  //runtime数据清洗
  if (result.data.runtime.length) {
    runtimeData.value = result.data.runtime.map(e => ({
      value: e.board_count,
      name: e.board_key,
    }));
    runtimeRate.value = result.data.runtimeerrorRate;
    let runtimeNum = parseFloat(runtimeRate.value);
    runtimeScore.value = getScore(runtimeNum);
    runtimeErrorOption.value = getUrlErrorOptions(runtimeData.value, runtimeScore.value);
    loading.value.runtimeLoading = 2;
  } else {
    loading.value.runtimeLoading = 1;
  }
  //resource数据清洗
  if (result.data.resource.length) {
    resourceData.value = result.data.resource.map(e => ({
      value: e.board_count,
      name: e.board_key,
    }));
    resourceRate.value = result.data.resourceerrorRate;
    let resourceNum = parseFloat(resourceRate.value + '');
    resourceScore.value = getScore(resourceNum);
    resourceErrorOption.value = getUrlErrorOptions(resourceData.value, resourceScore.value);
    loading.value.resourceLoading = 2;
  } else {
    loading.value.resourceLoading = 1;
  }
  let whiteNum = parseFloat(whiteRate.value + '');
  whiteScore.value = getScore(whiteNum);
  stabilityScore.value = (
    (runtimeScore.value + resourceScore.value + whiteScore.value) /
    3
  ).toFixed(0);
  emit('stabilityScoreChange', parseFloat(stabilityScore.value));
}

async function initWhite(params) {
  let p = {
    start_time: `${params.start_time} 00:00:00`,
    end_time: `${params.end_time} 00:00:00`,
    url: params.board_url,
  };
  let result = await getWhiteRate(p);
  if (Object.keys(result.data).length === 0 || result.data.errcode) {
    //message.error("白屏部分："+result.data.msg);
    whiteRate.value = +'0%';
    noWhite.value = true;
  } else {
    whiteRate.value = result.data.rate ? result.data.rate : +'0%';
    noWhite.value = false;
  }
}


</script>

<style scoped lang="scss">
@import './weekly.scss';
</style>
