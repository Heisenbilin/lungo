<template>
  <div class="chart-container-full">
    <div class="chart-title mb-3 relative">
      页面列表
      <div v-if="showLighthouseStatus" class="absolute top-0 right-0 text-sm font-normal">
        <span class="mr-5">URL执行lighthouse成功数量：{{ lighthouseSuccessTotal }}</span>
        <span class="mr-5">URL执行lighthouse失败数量：{{ lighthouseErrorTotal }}</span>
        <a @click="operateLighthouse">
          <a-tooltip :overlayStyle="{ maxWidth: '200px' }">
            <template #title>
              仅执行失败状态url，执行lighthouse时间较长，请稍后刷新页面查看
            </template>
            <InfoCircleOutlined />
          </a-tooltip>
          执行lighthouse
        </a>
      </div>
    </div>

    <a-table
      v-if="loaded"
      :columns="urlColumns"
      :data-source="urlList"
      :row-key="record => record.board_url"
      size="middle"
      :pagination="pagination"
      @change="handleTableChange"
      tableLayout="fixed"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'URL'">
          <a-tooltip title="点击进入原始页面">
            <span>
              <a :href="record.board_url" target="_blank">{{ record.board_url }}</a>
            </span>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'operation'">
          <router-link :to="toReport(record.board_url)">查看页面质量周报</router-link>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
//页面详细质量周报表格
import { ref, watch, computed, reactive } from 'vue'
import { retryLighthouse } from '@/apis/report/apis'
import { getProjectLighthouseStatus, getProjectBoardUrl } from '@/apis/report/index'
import { defaultColumns } from '../config'
import { commafy } from '@vben/utils'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useReportStore } from '@/store/modules/report'
import { cloneDeep } from '@vben/utils'

const reportStore = useReportStore()
const projectId = computed(() => reportStore.boardInfoState.id)
const startTime = computed(() => reportStore.filterState.start_time)
const endTime = computed(() => reportStore.filterState.end_time)

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showQuickJumper: false,
})
const urlList = ref([])
const loaded = ref(false)
const lighthouseSuccessTotal = ref(0)
const lighthouseErrorTotal = ref(0)

const urlColumns = computed(() => {
  let urlColumns = cloneDeep(defaultColumns)
  if (showLighthouseStatus.value) {
    urlColumns.splice(
      6,
      0,
      {
        title: 'lighthouse执行状态',
        width: '10%',
        dataIndex: 'lighthouse_status',
        key: 'lighthouse_status',
        align: 'center',
      },
      {
        title: 'lighthouse执行失败原因',
        width: '12%',
        dataIndex: 'lighthouse_reason',
        key: 'lighthouse_reason',
        align: 'center',
      },
    )
  }
  urlColumns[0]!.customRender = item =>
    (pagination.current - 1) * pagination.pageSize + item.index + 1
  return urlColumns
})

const showLighthouseStatus = computed(() => {
  const timeDot = new Date('2021-11-22 00:00:00').getTime()
  const time = new Date(startTime.value).getTime()
  return time >= timeDot
})

const getProjectLighthouseData = async () => {
  try {
    const { data } = await getProjectLighthouseStatus({
      project_id: projectId.value,
      start_time: startTime.value,
      end_time: endTime.value,
    })
    const { errorTotal, successTotal } = data
    lighthouseSuccessTotal.value = successTotal
    lighthouseErrorTotal.value = errorTotal
  } catch (error) {
    console.log('error', error)
  }
}

const operateLighthouse = async () => {
  try {
    await retryLighthouse({
      project_id: projectId.value,
      start_time: startTime.value,
      end_time: endTime.value,
      lighthouse_status: 'error',
    })
    message.success('正在重试中，请稍后刷新页面查看')
  } catch (error) {
    console.log('error', error)
  }
}
//处理表格页面变化与排序变化
const handleTableChange = async (page, _, sorter) => {
  //case1: 页码无跳转，一定是有排序选择变化，跳转至首页进行排序
  if (page.current === pagination.current) {
    pagination.current = 1
    //无order
    if (!sorter.order) {
      getUrlByPro()
    } else {
      getUrlByPro(1, sorter.order, sorter.field)
    }
  }
  // pageSize变化，请求新数据
  else if (page.pageSize !== pagination.pageSize) {
    pagination.pageSize = page.pageSize
    //无order
    if (!sorter.order) {
      getUrlByPro(1)
    } else {
      getUrlByPro(1, sorter.order, sorter.field)
    }
  }
  //case2: 非默认排序下的页面跳转，保留排序状态跳转页面
  else if (sorter.order) {
    pagination.current = page.current
    getUrlByPro(page.current, sorter.order, sorter.field)
  }
  //case3: 默认排序下的页面跳转
  else {
    pagination.current = page.current
    getUrlByPro(page.current)
  }
}

//后台数据获取与处理
const getUrlByPro = async (page = 1, order = null, field = null, limit = 10) => {
  let params = {
    project_id: projectId.value,
    start_time: startTime.value,
    end_time: endTime.value,
    page,
    limit,
    order,
    field,
  }
  const result = await getProjectBoardUrl(params)

  if (result.msg === 'success') {
    pagination.total = +result.data.total
    if (pagination.total / pagination.pageSize > 10) {
      pagination.showQuickJumper = true
    }
    urlList.value = result.data.projectList.map(item => {
      const statusTxt =
        item.lighthouse_status === 'success'
          ? '成功'
          : item.lighthouse_status === 'error'
          ? '失败'
          : '未开始'
      let reason = (item.lighthouse_reason + '').toLowerCase()
      if (reason && reason.includes('error')) {
        reason = '检测异常'
      }
      return {
        board_url: item.board_url,
        pv: commafy(item.pv_count),
        avg_score: item.total_score,
        performance_score: item.performance_score,
        stability_score: item.stable_score,
        lighthouse_reason: reason,
        lighthouse_status: statusTxt,
      }
    })
    loaded.value = true
  }
}

watch(
  () => [projectId, startTime, endTime],
  () => {
    loaded.value = false
    if (projectId.value) {
      getUrlByPro()
      getProjectLighthouseData()
    }
  },
  { immediate: true, deep: true },
)

const toReport = url => ({
  name: 'qcReport',
  query: {
    projectId: projectId.value,
    project_name: encodeURIComponent(reportStore.boardInfoState.project_name),
    url: encodeURIComponent(url),
    start_time: startTime.value,
    end_time: endTime.value,
  },
})
</script>

<style lang="scss" scoped></style>
