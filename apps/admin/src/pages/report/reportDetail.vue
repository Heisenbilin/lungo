<template>
  <div class="weekly-main" id="weekly-main-container">
    <div class="title">质量周报</div>

    <url-base :score="score" />
    <a-divider style="background-color: #555" />

    <url-performance
      @performanceScoreChange="performanceScoreChange"
      :lighthouseLoading="lighthouseLoading"
      :preparedLighthouse="lighthouseLoading === 2 ? lighthouseData.categories.performance : {}"
      :groups="lighthouseLoading === 2 ? lighthouseData.categoryGroups : {}"
    />
    <a-divider style="background-color: #555" />

    <url-stability
      @stabilityScoreChange="stabilityScoreChange"
      :lighthouseLoading="lighthouseLoading"
      :preparedLighthouse="lighthouseLoading === 2 ? lighthouseData.categories.accessibility : {}"
      :groups="lighthouseLoading === 2 ? lighthouseData.categoryGroups : {}"
    />
  </div>
</template>

<script setup lang = 'ts'>
import { onMounted, ref } from 'vue';
// import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { prepareReportResult } from './detail/util';
import { getLighthouseAudits } from '@/apis/report/apis';
// import drawWatermark from '/@/utils/watermark';
import { useWatermark } from '@vben/hooks'

import urlBase from './detail/urlBase.vue';
import urlPerformance from './detail/urlPerformance.vue';
import urlStability from './detail/urlStability.vue';

// interface LighthouseType {
//     categories: {
//       performance: any;
//       accessibility: any;
//     };
//     categoryGroups: any;
// }

//页面质量周报组件框架
    const props = defineProps({
      type: String,
    });
    // const store = useStore();
    const route = useRoute();
    const username = 'xiongbiling'
    const score = ref({
      performanceScore: 0,
      stabilityScore: 0,
    });
    const lighthouseLoading = ref(0);
    const lighthouseData =<any> ref([]);

    onMounted(() => {
      initAudits();
      createWatermark();
    });

    function performanceScoreChange(newScore) {
      score.value.performanceScore = newScore;
    }

    function stabilityScoreChange(newScore) {
      score.value.stabilityScore = newScore;
    }

    async function initAudits() {
      const { start_time, project_id, url: board_url } = route.query;
      const lighthouseParams = {
        project_url: decodeURIComponent(board_url as string),
        start_time: start_time + ' 00:00:00',
        project_id,
      };
      //获取lighthouse建议数据
      const lighthouse = await getLighthouseAudits(lighthouseParams);

      if (lighthouse.stat === 1 && lighthouse.data) {
        //lighthouse数据预处理
        lighthouseData.value = prepareReportResult(lighthouse.data);

        lighthouseLoading.value = 2;
      } else {
        lighthouseLoading.value = 1;
      }
    }

    // 生成水印
    function createWatermark() {
      const { project_name } = route.query;
      // const username = store.state.userInfo.name || '';
      const projectName = decodeURIComponent(project_name as string) || '';
      const container = document.getElementById('weekly-main-container');
      if (container) {
        useWatermark({
          container: container,
          content: `${props.type ? '华佗' : '小松鼠'}-${projectName}-${username}`,
          // rotate默认30度，因此长宽比为1.732:1能最大程度利用空间（容纳最多字符）
          width: '320px',
          height: '300px',
          font: '7.5px Microsoft Yahei Light',
        });
      }
    }


</script>

<style scoped lang="scss">
.weekly-main {
  box-sizing: content-box;
  width: 800px;
  height: auto;
  background-color: #ffffff;
  margin: auto;
  padding: 47px 90px;
}
.title {
  color: #000000;
  font-size: 30px;
  line-height: 24px;
  margin: 20px;
  text-align: center;
}
</style>
