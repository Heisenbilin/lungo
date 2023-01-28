<template>
  <div>
    <div>
      <span class="info-title">项目名称：</span
      ><span class="info-content">{{ urlInfo.projectName }}</span>
    </div>
    <div>
      <span class="info-title">页面URL：</span>
      <span class="info-content">
        <a :href="urlInfo.boardURL" target="_blank">{{ urlInfo.boardURL }}</a>
      </span>
    </div>
    <div>
      <span class="info-title">报告时间：</span>
      <span class="info-content">{{ urlInfo.reportTime }}</span>
    </div>
  </div>
  <div class="score-all">
    <div>
      <circle-progress ref="$circle" class="progress" key="duration-model" :progress="avgScore" />
      <div class="pro-label">总评</div>
    </div>
    <div>
      <circle-progress
        ref="$circle"
        class="progress"
        key="duration-model"
        :progress="score.performanceScore"
      />
      <div class="pro-label">性能</div>
    </div>
    <div>
      <circle-progress
        ref="$circle"
        class="progress"
        key="duration-model"
        :progress="score.stabilityScore"
      />
      <div class="pro-label">稳定性</div>
    </div>
  </div>
  <div class="score-range">
    <span class="score-item">
      <i class="el-icon-caret-top"></i>
      <span class="score-text">0-49</span>
    </span>
    <span class="score-item">
      <i class="el-icon-middle"></i>
      <span class="score-text">50-74</span>
    </span>
    <span class="score-item">
      <i class="el-icon-cicle"></i>
      <span class="score-text">75-100</span>
    </span>
  </div>

  <div class="suggestion">
    <span class="info-title"> 总评分数计算规则： </span>
    <span>
      <ul>
        <li>总评分数 = (性能评分+稳定性评分) / 2 。</li>
        <li>
          性能与稳定性都非常重要，开发者需充分考虑性能与稳定性两方面的质量，避免出现“偏科”的情况。
        </li>
      </ul>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import  CircleProgress  from '@vben/components/src/chart/circleProgress.vue';
// import { formatToDate } from '@vben/utils';
// import moment from 'moment';
import  dayjs  from 'dayjs';

//页面质量周报总评组件
const props = defineProps({
  score:{
    type: Object,
    default: () => {
      return {
        performanceScore: 0,
        stabilityScore: 0,
      };
    },
  }
})

  // props: ['score'],

    const route = useRoute();
    const urlInfo = ref({
      //基本信息
      projectName: '',
      boardURL: '',
      reportTime: '',
    });
    const avgScore = computed(() => {
      const avg = (props.score.stabilityScore + props.score.performanceScore) / 2;
      return avg.toFixed(0);
    });

    onMounted(() => {
      const { start_time, end_time, url: board_url, project_name } = route.query;
      urlInfo.value = {
        projectName: decodeURIComponent(project_name as string), 
        boardURL: decodeURIComponent(board_url  as string),
        reportTime: `${start_time}至${dayjs(end_time as string).subtract(1, 'd').format('YYYY-MM-DD')}`,
      };
    });

</script>

<style scoped lang="scss">
@import './weekly.scss';
</style>
