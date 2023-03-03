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
        <a-tooltip title="点击跳转至该页面">
          <a :href="record.err_currenthref" target="_blank">
            {{ record.err_currenthref || '未知' }}
          </a>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'file'">
        <a-tooltip title="点击跳转至该文件">
          <a :href="record.error_url" target="_blank">
            {{ record.error_url }}
          </a>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operation'">
        <template v-if="record.err_currenthref">
          <span class="mr-2" v-if="!requestParams.url">
            <a @click="() => addFilter(record.err_currenthref || '未知')">设为筛选</a>
          </span>
          <span class="mr-2" v-else>
            <a @click="delFilter">取消筛选</a>
          </span>
        </template>
        <span>
          <a @click="() => openLog(record.error_content || record.err_currenthref)">查看日志</a>
        </span>
      </template>
      <template v-if="column.key === 'count'"> {{ commafy(record.count) }} </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
// 运行时异常数据汇总Tab内部图表组件
import { ref, computed, watch, reactive } from 'vue'
import { debounce, commafy } from '@vben/utils'
import { getDefaultColumns } from './resultTabTableConfig'
import { useBoardStore } from '@/store/modules/board'
import { logTypeEnum } from '@vben/constants'
import { getListData } from '@/apis/board/runtime'

const boardStore = useBoardStore()

const props = defineProps({
  searchValue: {
    type: String,
    default: '',
  },
  type: String,
})

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.boardInfoState.id}`, //项目id
  start_time: boardStore.filterState.start_time, //开始时间
  end_time: boardStore.filterState.end_time, //结束时间
  url: boardStore.filterState.url, //路由筛选
  browser: boardStore.filterState.browser, //浏览器筛选
  device: boardStore.filterState.device, //设备筛选
  province: boardStore.filterState.province, //地区筛选
  network: boardStore.filterState.network, //网络类型筛选
  client: boardStore.filterState.client, //客户端筛选
  os: boardStore.filterState.os, //操作系统筛选
}))

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
  const columns: any[] = getDefaultColumns(props.type)
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
  getListData({
    ...requestParams.value,
    error_content: props.searchValue,
    error_type: props.type,
    limit: `${pagination.pageSize}`,
    page: `${page}`,
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
        //为过多的分页添加快速跳(转输入框
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
}, 500)

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

// 设为筛选
const addFilter = url => {
  boardStore.addFilterValue({ url })
}

// 取消筛选
const delFilter = () => {
  boardStore.delFilterValue('url')
}

//打开日志详情
const openLog = content => {
  boardStore.openLogInfoState({
    type: logTypeEnum.RUNTIME,
    visible: true,
    requestParams: {
      error_content: content,
      error_type: props.type,
    },
  })
}

watch(
  [() => props.searchValue, requestParams],
  () => {
    getResultTableData(1)
  },
  { immediate: true },
)
</script>
