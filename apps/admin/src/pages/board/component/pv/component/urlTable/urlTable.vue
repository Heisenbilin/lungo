<template>
  <div class="chart-container-full">
    <a-tabs v-model:activeKey="activeKey" class="box-border w-full">
      <a-tab-pane key="url" tab="页面访问统计">
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
                <a :href="record.url" target="_blank">
                  {{ record.url || '未知' }}
                </a>
              </a-tooltip>
            </template>
            <template v-if="column.key === 'count'"> {{ commafy(record.count) }} </template>
            <template v-if="column.key === 'operation'">
              <span v-if="!requestParams.url">
                <a @click="() => addFilter(record.url || '未知')">设为筛选</a>
              </span>
              <span v-else>
                <a @click="delFilter">取消筛选</a>
              </span>
              <span class="ml-2">
                <a @click="() => openLog(record.url)">查看日志</a>
              </span>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, reactive } from 'vue'
import { getDefaultColumns } from './urlTableConfig'
import { getUrlListData } from '@/apis/board/pv'
import { debounce, commafy } from '@vben/utils'
import { useBoardStore } from '@/store/modules/board'
import { logTypeEnum } from '@vben/constants'

const boardStore = useBoardStore()

//表格页码
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showQuickJumper: false,
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
  performance_key: boardStore.filterState.performance_key, //性能筛选
  performance_range: boardStore.filterState.performance_range, //性能筛选
}))

//表格loading
const loading = ref(true)

//生成表格序号
const tableColumns = computed(() => {
  const columns = getDefaultColumns()
  columns[0].customRender = item => (pagination.current - 1) * pagination.pageSize + item.index + 1
  return columns
})

//tab页key值与对应的看板type
const activeKey = ref('url')

//搜索内容
// const searchValue = ref('');

//表格数据
const dataList = ref([])
//请求序号，防止前面的请求返回结果覆盖后面的
let lastSearchId = 0
const getTableData = debounce((page = pagination.current) => {
  lastSearchId += 1
  const searchId = lastSearchId
  //开始loading
  loading.value = true
  //开始请求
  getUrlListData({
    ...requestParams.value,
    // current_href: searchValue.value,
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
        // 为过多的分页添加快速跳转输入框
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
    getTableData()
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

watch(
  requestParams,
  () => {
    getTableData()
  },
  { immediate: true },
)

const addFilter = url => {
  boardStore.addFilterValue({ url })
}

const delFilter = () => {
  boardStore.delFilterValue('url')
}

const openLog = url => {
  boardStore.openLogInfoState({
    type: logTypeEnum.PERFORMANCE,
    visible: true,
    requestParams: {
      current_href: url,
    },
  })
}
</script>
