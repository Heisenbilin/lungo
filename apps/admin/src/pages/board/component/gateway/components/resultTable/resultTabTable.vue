<template>
  <a-table
    :columns="tableColumns"
    :data-source="dataList"
    size="middle"
    :pagination="pagination"
    @change="handleTableChange"
    tableLayout="fixed"
    :loading="loading"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'url'">
        {{ record.url }}
      </template>
      <template v-if="column.key === 'operation'">
        <span v-if="record.url !== searchUrl">
          <a @click="changeSearchUrl(record.url)">设为筛选</a>
        </span>
        <span v-else>
          <a @click="cancelSearchUrl()">取消筛选</a>
        </span>
        <span class="ml-2">
          <a @click="openLog(record.url)">查看日志</a>
        </span>
      </template>
      <template v-if="column.key === 'count'"> {{ commafy(record.count) }} </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { getResultType } from '@/apis/board/gateway'
import { debounce, commafy } from '@vben/utils'
import { getDefaultColumns } from './resultTabTableConfig'
import { useBoardStore } from '@/store/modules/board'
import { logTypeEnum } from '@vben/constants'

const boardStore = useBoardStore()

//api异常数据汇总Tab内部图表组件
const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  searchUrl: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:searchUrl'])

//表格loading
const loading = ref(true)
//表格页码
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showQuickJumper: false,
})
//生成表格序号
const tableColumns = computed(() => {
  const columns: any[] = getDefaultColumns()
  columns[0].customRender = item => (pagination.current - 1) * pagination.pageSize + item.index + 1
  return columns
})

//表格数据
const dataList = ref([])
//请求序号，防止前面的请求返回结果覆盖后面的
let lastSearchId = 0
const getResultTableData = debounce((page = pagination.current) => {
  lastSearchId += 1
  const searchId = lastSearchId
  //开始loading
  loading.value = true
  //开始请求
  getResultType({
    project_id: boardStore.boardInfoState.id,
    start_time: boardStore.filterState.start_time,
    end_time: boardStore.filterState.end_time,
    response_type: props.type,
    request_url: props.searchUrl,
    limit: pagination.pageSize,
    page: page,
  })
    .then(data => {
      if (searchId !== lastSearchId) {
        // for fetch callback order
        return
      }
      if (data.stat === 1) {
        dataList.value = data.data.list
        pagination.current = page
        pagination.total = data.data.total
        //为过多的分页添加快速跳转输入框
        if (pagination.total && pagination.total / pagination.pageSize > 10) {
          pagination.showQuickJumper = true
        }
      } else {
        dataList.value = []
        pagination.current = 1
        pagination.total = 0
        pagination.showQuickJumper = false
      }
    })
    .finally(() => {
      loading.value = false
    })
}, 300)

//表格变化时触发  , _, sorter
const handleTableChange = page => {
  //页面跳转，请求数据
  if (page.current !== pagination.current) {
    //case1: 页码无跳转，一定是有排序选择变化，跳转至首页进行排序
    // pagination.current = 1;
    //无order
    // if (!sorter.order) {
    pagination.current = page.current
    getResultTableData()
    // } else {
    //   this.getUrlByPro(1, sorter.order, sorter.field);
    // }
  }
  // //case2: 非默认排序下的页面跳转，保留排序状态跳转页面
  // else if (sorter.order) {
  //   this.pagination.current = page.current;
  //   this.getUrlByPro(page.current, sorter.order, sorter.field);
  // }
  // //case3: 默认排序下的页面跳转
  // else {
  //   this.pagination.current = page.current;
  //   this.getUrlByPro(page.current);
  // }
}

const changeSearchUrl = url => {
  emit('update:searchUrl', url)
}

const cancelSearchUrl = () => {
  emit('update:searchUrl', '')
}

//打开日志详情
const openLog = url => {
  boardStore.openLogInfoState({
    type: logTypeEnum.GATEWAY,
    visible: true,
    requestParams: {
      request_url: url,
      response_type: props.type,
    },
  })
}

watch(
  () => [props.searchUrl, boardStore.filterState.start_time, boardStore.filterState.end_time],
  () => {
    getResultTableData(1)
  },
  { immediate: true },
)
</script>
