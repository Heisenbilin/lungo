<template>
  <h1>一、项目总评</h1>
  <div v-if="loading === 1" class="flex min-h-60 justify-center items-center">
    <a-spin size="large" />
  </div>
  <a-empty v-else-if="loading === 0" class="flex min-h-60 justify-center items-center" :image="simpleImage" />
  <a-row v-else class="project-score min-h-60" id="project-score">
    <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
      <circle-progress ref="$circle" class="progress" key="duration-model" :progress="total_score" />
      <div class="pro-label">项目质量</div>
    </a-col>
    <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
      <circle-progress ref="$circle" class="progress" key="duration-model" :progress="performance_score" />
      <div class="pro-label">页面性能</div>
    </a-col>
    <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
      <circle-progress ref="$circle" class="progress" key="duration-model" :progress="stability_score" />
      <div class="pro-label">服务稳定</div>
    </a-col>
    <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
      <div class="ranking">
        <span class="rank">{{ rank }}</span>
        <span class="total">/{{ total }}</span>
      </div>
      <div class="pro-label">综合排名</div>
    </a-col>
  </a-row>
</template>

<script setup lang ='ts'>
import { ref, watch, computed } from 'vue';
// import { useStore } from 'vuex';
// import { CircleProgress } from '/@/components/circle';
import { getProjectRanking } from '../apis';
// import { formatDate } from '/@/utils/date';
import { Empty } from 'ant-design-vue';
import { useReportStore } from '@/store/modules/report';
const reportStore = useReportStore()
// import * as echarts from 'echarts';

const total_score = ref(0);
const performance_score = ref(0);
const stability_score = ref(0);
const rank = ref(0);
const total = ref(0);
const loading = ref(0); //0为加载，1无数据，2有数据
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);

const params = computed(() => ({
  project_id: `${reportStore.getBoardInfoState.id}`,
  start_time: reportStore.getFilterState.start_time,
  end_time: reportStore.getFilterState.end_time,
}));

watch(params, initData, { immediate: true });

//后台数据获取与处理
async function initData() {
  try {
    //项目评分 数据获取预处理
    loading.value = 0;
    let scoreData = await getProjectRanking(params.value);
    if (scoreData.msg === 'success') {
      loading.value = 2;
      total_score.value = scoreData.data ? scoreData.data.total_score : 0;
      performance_score.value = scoreData.data ? scoreData.data.performance_score : 0;
      stability_score.value = scoreData.data ? scoreData.data.stable_score : 0;
      rank.value = scoreData.data ? scoreData.data.rank : 0;
      total.value = scoreData.data ? scoreData.data.total : 0;
    } else {
      loading.value = 1;
    }
  } catch (e) {
    console.log('项目总评加载失败:', e);
  }
}
</script>

<style lang="scss" scoped>
@import './board.scss';
</style>
