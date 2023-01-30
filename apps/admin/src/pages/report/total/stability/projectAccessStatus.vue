<template>
  <span v-if="sourceMapAccessStatus !== 'noData'">
    <span v-if="sourceMapAccessStatus === 'notAccess'" style="color: #ee6666">
      <InfoCircleOutlined />
      sourcemap未接入
      <a href="https://app.xesv5.com/doc/pages/fedata/sourcemap/sourcemap.html" target="_blank">
        ,接入文档
      </a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
    <span v-else style="color: #3aa272">
      <CheckCircleOutlined /> sourcemap接入成功&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  </span>
  <span v-if="cdnAccessStatus !== 'noData'">
    <span v-if="cdnAccessStatus === 'notAccess'" style="color: #ee6666">
      <InfoCircleOutlined />
      CDN未接入
      <a href="https://cloud.tal.com/docs/k8s/quick_start/k8s-oss.html" target="_blank">
        ,接入文档
      </a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
    <span v-else style="color: #3aa272">
      <CheckCircleOutlined />
      CDN接入成功&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  </span>
  <span v-if="resourceAccessStatus !== 'noData'">
    <span v-if="resourceAccessStatus === 'notAccess'" style="color: #ee6666">
      <InfoCircleOutlined />
      资源容错未接入
      <a
        href="http://app.xesv5.com/doc/pages/fedata/url-fallback/intro.html#%E4%BB%8B%E7%BB%8D"
        target="_blank"
      >
        ,接入文档
      </a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
    <span v-else style="color: #3aa272">
      <CheckCircleOutlined />
      资源容错接入成功&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { reportApis } from '@/apis/report'
import { useBoardStore } from '@/store/modules/board'
const boardStore = useBoardStore()
//根据项目列表中sourcemap_analysis字段的值判定是否接入sourcemap
const sourceMapAccessStatus = computed(() => {
  switch (boardStore.boardInfoState.sourcemap_analysis) {
    case 0:
      return 'notAccess'
    case 1:
      return 'accessed'
    default:
      return 'noData'
  }
})

const cdnAccessStatus = ref('noData')
const resourceAccessStatus = ref('noData')

//检查容错是否接入
async function checkResource() {
  const resourceResult = await reportApis.checkResourceStatus(params.value)
  if (resourceResult?.stat === 1) {
    resourceAccessStatus.value =
      resourceResult.data.resourceResult === true ? 'accessed' : 'notAccess'
  }
}

//检查cdn是否接入
async function checkCDN() {
  const cdnResult = await reportApis.checkCDNStatus(params.value)
  if (cdnResult?.stat === 1) {
    cdnAccessStatus.value = cdnResult.data.cdnResult === true ? 'accessed' : 'notAccess'
  }
}

const params = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`,
  start_time: boardStore.filterState.start_time,
  end_time: boardStore.filterState.end_time,
}))

function initData() {
  // if(!params.value.project_id) return
  //异步check 容错接入
  checkResource()
  //异步check CDN接入
  checkCDN()
}

watch(() => params, initData, { immediate: true })
</script>
