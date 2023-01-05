<template>
  <a-table
    :columns="tableColumns"
    :data-source="dataList"
    :row-key="(_, i) => i"
    size="middle"
    :pagination="pagination"
    @change="handleTableChange"
    tableLayout="fixed"
    :loading="loading"
  >
    <template #url="{ record }">
      <a-tooltip title="点击跳转至该页面">
        <a :href="record.currenthref" target="_blank">
          {{ record.currenthref || '未知' }}
        </a>
      </a-tooltip>
    </template>
    <template #operation="{ record }">
      <template v-if="record.currenthref">
        <span class="mr-2" v-if="!requestParams.url">
          <a @click="changeSearchUrl(record.currenthref || '未知')">设为筛选</a>
        </span>
        <span class="mr-2" v-else>
          <a @click="cancelSearchUrl()">取消筛选</a>
        </span>
      </template>
      <span class="ml-2">
        <a @click="openLog(record.resource_url || record.currenthref)">查看日志</a>
      </span>
    </template>
    <template #count="{ record }"> {{ commafy(record.count) }} </template>
  </a-table>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { ApiErrorApis } from '/@/api/board/apiError';
import { debounce } from 'lodash-es';
import { getDefaultColumns } from './resultTabTableConfig';
import { commafy } from '/@/utils/math/formatMumber';
import { boardStore } from '/@/store/modules/board';
import { logTypeEnum } from '/@/enums/boardEnum';

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
});

//请求参数
const requestParams = computed(() => ({
  project_id: `${boardStore.getBoardInfoState.id}`, //项目id
  start_time: boardStore.getFilterState.start_time, //开始时间
  end_time: boardStore.getFilterState.end_time, //结束时间
  url: boardStore.getFilterState.url, //路由筛选
  browser: boardStore.getFilterState.browser, //浏览器筛选
  device: boardStore.getFilterState.device, //设备筛选
  region: boardStore.getFilterState.region, //地区筛选
  network: boardStore.getFilterState.network, //网络类型筛选
  client: boardStore.getFilterState.client, //客户端筛选
  os: boardStore.getFilterState.os, //操作系统筛选
  api_status: boardStore.getFilterState.api_status, //api状态码筛选
  api_range: boardStore.getFilterState.api_range, //api耗时筛选
}));

// 表格type
const responseType = computed(() => props.type.split('_')[0]);
const interfaceType = computed(() => props.type.split('_')[1]);
// 表格loading
const loading = ref(true);
// 表格页码
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showQuickJumper: false,
});
// 生成表格序号
const tableColumns = computed(() => {
  const columns = getDefaultColumns(interfaceType.value);
  columns[0].customRender = item => (pagination.current - 1) * pagination.pageSize + item.index + 1;
  return columns;
});

// 表格数据
const dataList = ref([]);
// 请求序号，防止前面的请求返回结果覆盖后面的
let lastSearchId = 0;
const getResultTableData = debounce((page = pagination.current) => {
  lastSearchId += 1;
  const searchId = lastSearchId;
  // 开始loading
  loading.value = true;
  // 开始请求
  ApiErrorApis.getResultListData({
    ...requestParams.value,
    response_type: responseType.value,
    interface_type: interfaceType.value,
    request_url: props.searchUrl?.trim(),
    limit: `${pagination.pageSize}`,
    page: `${page}`,
  })
    .then(data => {
      if (searchId !== lastSearchId) {
        // for fetch callback order
        return;
      }
      if (data.stat === 1) {
        dataList.value = data.data.list;
        pagination.current = page;
        pagination.total = data.data.total;
        // 为过多的分页添加快速跳转输入框
        if (pagination.total && pagination.total / pagination.pageSize > 10) {
          pagination.showQuickJumper = true;
        }
      } else {
        dataList.value = [];
        pagination.current = 1;
        pagination.total = 0;
        pagination.showQuickJumper = false;
      }
    })
    .finally(() => {
      loading.value = false;
    });
}, 500);

// 表格变化时触发  , _, sorter
const handleTableChange = page => {
  // 页面跳转，请求数据
  if (page.current !== pagination.current) {
    // case1: 页码无跳转，一定是有排序选择变化，跳转至首页进行排序
    // pagination.current = 1;
    // 无order
    // if (!sorter.order) {
    pagination.current = page.current;
    getResultTableData();
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
};

const changeSearchUrl = url => boardStore.addFilterValue({ url });
const cancelSearchUrl = () => boardStore.delFilterValue('url');
//打开日志详情
const openLog = url => {
  boardStore.openLogInfoState({
    type: logTypeEnum.API,
    visible: true,
    requestParams: {
      request_url: url,
      response_type: responseType.value,
      interface_type: interfaceType.value,
    },
  });
};

watch([() => props.searchUrl, requestParams], () => getResultTableData(1), { immediate: true });
</script>
