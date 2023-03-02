<template>
  <a-table
    :loading="loading"
    :columns="columns"
    :data-source="dataList"
    size="middle"
    :row-key="(_, index) => index"
    :pagination="pagination"
    @change="handleTableChange"
    tableLayout="fixed"
    bordered
  >
    <template #expandedRowRender="{ record }">
      <LogContent :content="record" />
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getTableColumns, getDataList } from './util'
import { useBoardStore } from '@/store/modules/board'
import { useReportStore } from '@/store/modules/report'
import LogContent from './logContent.vue'

const boardStore = useBoardStore()
const reportStore = useReportStore()

const props = defineProps({
  boardType: {
    type: String,
    default: 'general',
  },
})

const store = props.boardType === 'general' ? boardStore : reportStore

const loading = ref(true)
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showQuickJumper: false,
})
const columns = getTableColumns(store.logInfoState.type)
const dataList = ref([])

const handleTableChange = page => {
  pagination.current = page.current
  getAndSetTableData()
}

const getAndSetTableData = async () => {
  loading.value = true
  try {
    const data: any = await getDataList(
      store.logInfoState.type,
      store.logRequestParams,
      pagination.current,
      pagination.pageSize,
      store.boardInfoState.ua_flag,
    )
    const { result, total } = data
    dataList.value = result
    pagination.total = total
    //为过多的分页添加快速跳转输入框
    if (pagination.total && pagination.total / pagination.pageSize > 10) {
      pagination.showQuickJumper = true
    } else {
      pagination.showQuickJumper = false
    }
  } catch (e) {
    console.log('获取异常详情列表数据失败:', e)
  }
  loading.value = false
}

// 重新请求log数据之后重新渲染表格
onMounted(async () => {
  getAndSetTableData()
})
</script>

<style lang="less" scoped>
:deep(.ant-table-expanded-row) {
  background-color: white;
}
</style>
