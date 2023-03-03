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
        <a-tooltip title="点击跳转">
          <a v-if="record.url || record.resource_currenthref" :href="record.url" target="_blank">
            {{ record.url || record.resource_currenthref }}
          </a>
          <template v-else>未知</template>
        </a-tooltip>
      </template>
      <template v-if="column.key === 'operation'">
        <template v-if="record.resource_currenthref">
          <span class="mr-2" v-if="!requestParams.url">
            <a @click="() => changeSearchUrl(record.resource_currenthref || '未知')">设为筛选</a>
          </span>
          <span class="mr-2" v-else>
            <a @click="() => cancelSearchUrl()">取消筛选</a>
          </span>
        </template>
        <span>
          <a @click="() => openLog(record)">查看日志</a>
        </span>
      </template>
      <template v-if="column.key === 'count'"> {{ commafy(record.count) }} </template>
      <template v-if="column.key === 'user'"> {{ commafy(record.userCount) }} </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
//资源异常数据汇总Tab内部图表组件
import { ref, computed, watch, reactive } from 'vue'
import { getFErrorListData, getListData } from '@/apis/board/resource'
import { debounce, commafy } from '@vben/utils'
import { getDefaultColumns } from './resultTabTableConfig'
import { useBoardStore } from '@/store/modules/board'
import { logTypeEnum } from '@vben/constants'

const boardStore = useBoardStore()

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  searchValue: {
    type: String,
    default: '',
  },
})

const isFaultTolerant = props.type === 'faultTolerant' ? true : false

// 表格loading
const loading = ref(true)
// 表格页码
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showQuickJumper: false,
})

// 表格列，自动生成表格序号
const tableColumns = computed(() => {
  const columns = getDefaultColumns(props.type)
  columns[0].customRender = item => (pagination.current - 1) * pagination.pageSize + item.index + 1
  return columns
})
// 表格数据
const dataList = ref([])

// 请求序号，防止前面的请求返回结果覆盖后面的
let lastSearchId = 0

//请求参数
const requestParams = computed(() => {
  return Object.assign(
    {
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
      resource_type: boardStore.filterState.resource_type, //资源类型筛选
      limit: `${pagination.pageSize}`,
    },
    isFaultTolerant
      ? {}
      : {
          error_type: props.type,
          error_content: props.searchValue,
        },
  )
})

const getApiData = async params => {
  return await (isFaultTolerant ? getFErrorListData(params) : getListData(params))
}

const getResultTableData = debounce((page = pagination.current) => {
  lastSearchId += 1
  const searchId = lastSearchId
  //开始loading
  loading.value = true
  //开始请求
  getApiData({
    ...requestParams.value,
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

// 改变日志state，打开日志详情
const openLog = record => {
  if (props.type === 'href' || props.type === 'domain') {
    boardStore.openLogInfoState({
      type: logTypeEnum.RESOURCE,
      visible: true,
      requestParams: {
        error_type: props.type,
        err_content: props.type === 'href' ? record.resource_url : record.current_href,
      },
    })
  }
  if (isFaultTolerant) {
    boardStore.openLogInfoState({
      type: logTypeEnum.FAULTTOLERANT,
      visible: true,
      requestParams: {
        successresource: record.successsource,
      },
    })
  }
}

// 设为筛选
const changeSearchUrl = url => {
  boardStore.addFilterValue({ url })
}

// 取消筛选
const cancelSearchUrl = () => {
  boardStore.delFilterValue('url')
}

watch(
  [() => props, requestParams],
  () => {
    getResultTableData(1)
  },
  { immediate: true },
)
</script>
