<template>
  <div class="project-board-container">
    <div class="grid grid-cols-2 gap-3">
      <div class="chart-container py-0">
        <InfoCard boardType="report" />
      </div>
      <div v-if="boardInfoState.id" class="chart-container py-0">
        <ReportFilterCard />
      </div>
    </div>

    <div v-if="boardInfoState.id" class="project-board" id="project-boardReport-content">
      <projectScore />
      <projectBase />
      <projectPerformance />
      <projectStability />
      <div v-if="warnMessage.length">
        <span class="warn-massage">{{ warnMessage }}</span>
      </div>
      <urlTable v-else :type="platformType" />
    </div>
  </div>
</template>

<script setup lang="ts">
//新版质量周报详情页Index
import { ref, onMounted, provide } from 'vue'
import { useReportStore } from '@/store/modules/report'

import InfoCard from '@/pages/component/infoCard/index.vue'
import ReportFilterCard from '@/pages/component/filterCard/reportFilterCard.vue'

import projectScore from '@/pages/report/total/projectScore.vue'
import projectPerformance from '@/pages/report/total/projectPerformance.vue'
import projectStability from '@/pages/report/total/stability/index.vue'
import projectBase from '@/pages/report/total/projectBase.vue'
import urlTable from '@/pages/report/total/urlTable.vue'
import { storeToRefs } from 'pinia'

console.log('useReportStore', useReportStore())

defineProps({
  type: String,
  platformType: String,
})

const { boardInfoState } = storeToRefs(useReportStore())

//当使用手机查看时的警告信息
const warnMessage = ref('')
provide('warnMessage', warnMessage)
onMounted(() => {
  // //请求当前用户组管理的项目列表
  // getProjectListByGroup(Boolean(urlProjectId));
  //判断是否为手机查看
  if (isMobile()) {
    warnMessage.value = '推荐使用电脑端查看周报汇总及详情信息'
  }
})

//判断ua是否为移动端
function isMobile() {
  return navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  )
}
</script>

<style lang="scss" scoped>
:deep(.select-input) {
  .ant-select-selection-search-input {
    border-color: #fff;
  }
}

.project-board-container {
  overflow: hidden;
  min-height: 50vh;

  .project-board {
    padding: 2%;
    margin: 12px 0;
    background-color: white;
  }

  .warn-massage {
    font-size: 140%;
    color: #ff0000;
  }
}
</style>
