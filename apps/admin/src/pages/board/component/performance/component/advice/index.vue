<template>
  <div class="chart-container-full flex flex-col">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <div>
        <span class="chart-title !mt-2 mr-2"> 性能优化建议 </span>
        <a-select v-model:value="currentUrl" class="min-w-min">
          <a-select-option
            v-for="item in successList"
            :key="item.board_url"
            :value="item.board_url"
          >
            {{ item.board_url }}
          </a-select-option>
        </a-select>
      </div>
      <router-link :to="detailReport">
        <span class="!mt-2">跳转该页面详细质量周报</span>
      </router-link>
    </div>
    <div class="flex items-center justify-center min-h-80 pt-5 px-2">
      <a-spin size="large" v-if="lighthouseLoading === 0" />
      <a-empty v-else-if="lighthouseLoading === 1" :image="simpleImage" />
      <div class="w-full" v-else>
        <audit-layout
          v-if="opportunityAudits.length"
          :audits="opportunityAudits"
          :group="groups['load-opportunities']"
        />
        <audit-layout
          v-if="diagnosticAudits.length"
          :audits="diagnosticAudits"
          :group="groups.diagnostics"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { prepareReportResult, showAsPassed, _getWastedMs } from '@/pages/report/detail/audit/util'
import { getLighthouseAudits } from '@/apis/report/apis'
import auditLayout from '@/pages/report//detail/audit/auditLayout.vue'
import { useReportStore } from '@/store/modules/report'
import { Empty } from 'ant-design-vue'

const reportStore = useReportStore()

const props = defineProps({
  successList: {
    type: Array as PropType<any[]>,
    required: true,
  },
  projectId: String,
  startTime: String,
  endTime: String,
})
const reportUrl = computed(() => props.successList[0].board_url)
const currentUrl = ref(props.successList[0].board_url)
// console.log(props.successList[0].board_url);

//空数据图片
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

watch(reportUrl, () => (currentUrl.value = reportUrl.value), { immediate: true })

const lighthouseLoading = ref(0)
const lighthouseData = ref<any>([])
const preparedLighthouse = computed(() =>
  lighthouseLoading.value === 2 ? lighthouseData.value.categories.performance : {},
)
const groups = computed(() =>
  lighthouseLoading.value === 2 ? lighthouseData.value.categoryGroups : {},
)
const opportunityAudits = ref([])
const diagnosticAudits = ref([])

async function initAudits() {
  lighthouseLoading.value = 0
  const lighthouseParams = {
    project_url: currentUrl.value,
    start_time: props.startTime + ' 00:00:00',
    project_id: props.projectId,
  }
  //获取lighthouse建议数据
  const lighthouse = await getLighthouseAudits(lighthouseParams)
  if (lighthouse.stat === 1 && lighthouse.data) {
    //lighthouse数据预处理
    lighthouseData.value = prepareReportResult(lighthouse.data)
    lighthouseLoading.value = 2
  } else {
    lighthouseLoading.value = 1
  }
}

async function initAuditsShow() {
  //性能建议数据预处理
  // Opportunities
  // console.log(preparedLighthouse.value.auditRefs);
  opportunityAudits.value = preparedLighthouse.value.auditRefs
    .filter(audit => {
      return audit.group === 'load-opportunities' && !showAsPassed(audit.result)
    })
    .sort((auditA, auditB) => {
      return _getWastedMs(auditB) - _getWastedMs(auditA)
    })
  // Diagnostics
  diagnosticAudits.value = preparedLighthouse.value.auditRefs
    .filter(audit => {
      return audit.group === 'diagnostics' && !showAsPassed(audit.result)
    })
    .sort((a, b) => {
      const scoreA = a.result.scoreDisplayMode === 'informative' ? 100 : Number(a.result.score)
      const scoreB = b.result.scoreDisplayMode === 'informative' ? 100 : Number(b.result.score)
      return scoreA - scoreB
    })
}
//监听lighthouse数据加载标识，解析lighthouse数据
watch(currentUrl, initAudits, { immediate: true })
watch(lighthouseLoading, () => {
  if (lighthouseLoading.value === 2) {
    initAuditsShow()
  } else {
    opportunityAudits.value = diagnosticAudits.value = []
  }
})

//跳转页面详细质量周报处理
const detailReport = computed(() => ({
  name: 'qcReport',
  query: {
    project_id: props.projectId,
    project_name: encodeURIComponent(reportStore.boardInfoState.project_name),
    url: encodeURIComponent(currentUrl.value),
    start_time: props.startTime,
    end_time: props.endTime,
  },
}))
</script>
