<template>
  <a-table
    :loading="loading === 'loading'"
    :columns="projectListColumns"
    :dataSource="huatuoProjectList"
    :pagination="false"
    :scroll="{ x: 1600 }"
    :customRow="customRowWithScore"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'name'">
        <tableHeader
          :project="record"
          @star="starProject"
          :closeDays="closeDays"
          :isStar="isStar"
        />
      </template>
      <template v-if="column.key === 'sdk'">
        <div :style="{ display: show(record.close_project) }">
          <tableSdk :project="record" :latestSDKVersion="latestSDKVersion" />
        </div>
      </template>
      <template v-if="column.key === 'score'">
        <div
          class="text-center items-center opacity-80"
          :style="{ display: show(record.close_project) }"
        >
          <tableContent :projectId="record.id" title="分数" :data="record" :loading="loadingT" />
        </div>
      </template>

      <template v-if="column.key === 'pv'">
        <div :style="{ display: show(record.close_project) }">
          <tableContent :projectId="record.id" title="pv" :data="record" :loading="loadingT" />
        </div>
      </template>
      <template v-if="column.key === 'uv'">
        <div :style="{ display: show(record.close_project) }">
          <tableContent :projectId="record.id" title="uv" :data="record" :loading="loadingT" />
        </div>
      </template>
      <template v-if="column.key === 'runtimeError'">
        <div :style="{ display: show(record.close_project) }">
          <tableContent
            :projectId="record.id"
            title="运行时异常率"
            :data="record"
            :loading="loadingT"
          />
        </div>
      </template>
      <template v-if="column.key === 'resourceError'">
        <div :style="{ display: show(record.close_project) }">
          <tableContent
            :projectId="record.id"
            title="资源异常率"
            :data="record"
            :loading="loadingT"
          />
        </div>
      </template>
      <template v-if="column.key === 'success'">
        <div :style="{ display: show(record.close_project) }">
          <tableContent
            :projectId="record.id"
            title="请求成功率"
            :data="record"
            :loading="loadingT"
          />
        </div>
      </template>
      <template v-if="column.key === 'chartOption'">
        <div class="content" :style="{ display: show(record.close_project) }">
          <tableContent
            :projectId="record.id"
            title="活跃趋势"
            :data="record"
            :loading="loadingT"
          />
        </div>
      </template>
      <template v-if="column.key === 'pageloadData'">
        <div :style="{ display: show(record.close_project) }">
          <tableContent
            :projectId="record.id"
            title="页面加载"
            :data="record"
            :loading="loadingT"
          />
        </div>
      </template>
      <template v-if="column.key === 'screen'">
        <div v-if="record.close_project === 1">
          <a-popconfirm
            :title="`由于本项目连续${closeDays}无数据/手动关闭，现已关闭日志采集，确定要开启吗？`"
            ok-text="是"
            cancel-text="否"
            @confirm="() => openProject(record.id, index)"
          >
            <a-button type="primary"> <InfoCircleOutlined /> 开启项目 </a-button>
          </a-popconfirm>
        </div>
        <div v-else>
          <tableScreen :project="record" />
        </div>
      </template>
      <template v-if="column.key === 'action'">
        <tableActions
          :projectId="record.id"
          :collectFlag="record.collectFlag"
          @edit="id => emit('edit', id)"
          @star="starProject"
          :isStar="isStar"
        />
      </template>
    </template>
  </a-table>
  <div class="text-right mt-4">
    <Pagination
      @change="getHuatuoProjectList"
      v-model:current="currentPage"
      v-model:pageSize="pageSize"
      :total="total"
      show-size-changer
      :pageSizeOptions="
        [screenPageSize, screenPageSize * 2, screenPageSize * 3, screenPageSize * 4].map(String)
      "
      :show-total="total => `共${total}个应用`"
      :show-quick-jumper="total / pageSize > 10 ? true : false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message, Pagination } from 'ant-design-vue'
import { getProjectList, getProjectBoard, modifyProjectParams } from '@/apis/list'
import { debounce } from '@vben/utils'
import { useListStore } from '@/store/modules/list'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { getQuery, addOrUpdateQuery } from '@vben/router'
import { projectListColumns } from '../utils'
import tableActions from './tableActions.vue'
import tableHeader from './tableHeader.vue'
import tableScreen from './tableScreen.vue'
import tableContent from './tableContent.vue'
import tableSdk from './tableSdk.vue'

const listStore = useListStore()

const props = defineProps({
  requestParams: {
    required: true,
    type: Object,
  },
  isStar: {
    type: Boolean,
    default: false,
  },
  forceFlash: Boolean,
  dimension: {
    type: String,
    default: 'day',
  },
})
const emit = defineEmits(['edit'])
// 设置表格隐藏
const show = closeNum => {
  if (closeNum === 1) {
    return 'none'
  }
}

//页面卡片数量
// const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
const screenPageSize = 10

const { page = 1, page_size = screenPageSize, total: preTotal } = getQuery() as any
//页码
const total = ref(Number.isNaN(parseInt(preTotal)) ? 0 : parseInt(preTotal))
const pageSize = ref(+page_size)
const currentPage = ref(total.value && total.value > +page ? +page : 1) //防止tab切换时page溢出
// 防止页码超出时不显示
if (+page * page_size > preTotal) {
  // TODO message alert
  currentPage.value = 1
}
//loading
const loading = ref('loading')
//空数据图片
// const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
//华佗用户组应用列表
const huatuoProjectList = ref<any[]>([])
//当前最新sdk版本号
const latestSDKVersion = ref('2.4.5')
//关闭项目的天数阈值
const closeDays = ref('')

//搜索序号，防止前面的搜索返回结果覆盖后面的
let lastSearchId = 0
//获取华佗用户组对应应用列表
const getHuatuoProjectList = debounce(async (page = currentPage.value) => {
  loading.value = 'loading'
  lastSearchId += 1
  const searchId = lastSearchId
  const params = {
    name: props.requestParams.name,
    page,
    groupid: props.requestParams.groupid,
    page_size: pageSize.value,
    type: props.requestParams.projectType,
    saas: props.requestParams.saasType,
    collect_list: props.isStar ? 1 : 0,
    show: props.requestParams.show,
  }

  getProjectList(params).then(result => {
    if (searchId !== lastSearchId) {
      // for fetch callback order
      return
    }
    if (currentPage.value !== page) currentPage.value = page
    if (result.stat === 1 && Array.isArray(result.data.projects) && result.data.projects.length) {
      huatuoProjectList.value = result.data.projects
      total.value = result.data.total
      closeDays.value = `${result.data.closeDays}`
      if (result.data.latestSDKVersion !== '') {
        latestSDKVersion.value = result.data.latestSDKVersion
      }
      loading.value = 'complete'
      // 第一次table 初始化 每一个 itemData
      initTableContentData(searchId)
    } else {
      total.value = 0
      huatuoProjectList.value = []
      loading.value = 'empty'
    }
    addOrUpdateQuery({ ...params, total: total.value })
  })
}, 500)
// 请求详细数据的初始状态
const loadingT = ref(false)
//获取项目具体数据(分数、pv、uv等)
const initTableContentData = async searchId => {
  loadingT.value = true
  const otherParams = {
    start_time: listStore.startTime,
    end_time: listStore.endTime,
    dimension: listStore.dimension,
  }
  try {
    const mapResult = await Promise.all(
      huatuoProjectList.value.map(async item => {
        if (searchId !== lastSearchId) return
        try {
          const mapRes = await getProjectBoard({
            ...otherParams,
            project_id: item.id,
          })
          if (mapRes.stat === 1) {
            return { ...item, itemsData: mapRes.data }
          } else {
            return { ...item, itemsData: null }
          }
        } catch (e) {
          return { ...item, itemsData: null }
        }
      }),
    )
    if (searchId !== lastSearchId) return
    huatuoProjectList.value = mapResult
  } finally {
    loadingT.value = false
  }
}
// table颜色
const customRowWithScore = record => {
  if (record?.close_project === 1) {
    return { class: 'table-row-gray' }
  }
  if (record?.itemsData?.score < 50) {
    return { class: 'bg-red-50 dark:bg-black' }
  }
}

//收藏/取消应用时，告知父组件
const starProject = starId => {
  if (props.isStar) {
    //若在“我的收藏”列表进行收藏动作，必然为取消收藏，将项目列表对应的卡片删除
    // store.dispatch("actSetForceFlashFlag", "all");
    listStore.forceFlashFlag['all'] = !listStore.forceFlashFlag['all']
    huatuoProjectList.value = huatuoProjectList.value.filter(item => item.id !== starId)
  } else {
    //若在“全部应用”列表进行收藏动作，告知父组件强制刷新“我的收藏”列表
    listStore.forceFlashFlag['star'] = !listStore.forceFlashFlag['star']
  }
}
//处理重新打开项目
const openProject = async (id, index) => {
  const result = await modifyProjectParams(id, { close_project: 0 })
  if (result.stat === 1) {
    message.success('开启成功！')
    //请求项目数据
    const result = await getProjectBoard({
      start_time: listStore.startTime,
      end_time: listStore.endTime,
      dimension: listStore.dimension,
      project_id: id,
    })
    huatuoProjectList.value[index].itemsData = result.data || null
    huatuoProjectList.value[index].close_project = 0
    //刷新另一Tab
    const tabName = props.isStar ? 'all' : 'star'
    listStore.forceFlashFlag[tabName] = !listStore.forceFlashFlag[tabName]
  } else {
    message.error('开启失败，请重试或联系管理员')
  }
}

//监听页码变化，请求后端数据
watch(pageSize, () => getHuatuoProjectList(1))

//监听搜索内容、筛选条件变化，请求后端数据
watch(
  () => props.requestParams,
  (val, oldVal) => {
    if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
      getHuatuoProjectList(1)
    }
  },
)

//监听父组件的强制刷新指令，强制刷新项目列表（用在编辑完成、收藏完成等场景）
watch(
  () => props.forceFlash,
  () => getHuatuoProjectList(currentPage.value),
)
getHuatuoProjectList()

// 周/天变化
watch(
  () => listStore.dimension,
  () => initTableContentData(lastSearchId),
)
</script>

<style lang="less" scoped>
:deep(.bg-red-50) {
  td {
    background: inherit;
  }
}

:deep(.table-row-gray) {
  background: #d9d9d9;
}
</style>
