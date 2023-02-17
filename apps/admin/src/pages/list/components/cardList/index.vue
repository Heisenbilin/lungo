<template>
  <a-spin size="large" class="loading" v-if="loading === 'loading'" />
  <a-empty v-else-if="loading === 'empty'" class="loading" :image="simpleImage" />
  <div v-else class="flex flex-wrap">
    <template v-for="project of huatuoProjectList" :key="project.id">
      <div class="p-1 w-full xl:p-2 xl:w-1/2 2xl:w-1/3 3xl:p-3 3xl:w-1/4">
        <ProjectCard
          :project="project"
          @edit="id => emit('edit', id)"
          @star="starProject"
          :latestSDKVersion="latestSDKVersion"
          :closeDays="closeDays"
          :isStar="isStar"
        />
      </div>
    </template>
  </div>
  <div class="text-right">
    <a-pagination
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
import { Empty } from 'ant-design-vue'
import { getProjectList } from '@/apis/list'
import { caculatePageSizeByWidth } from '../utils'
import { debounce } from '@vben/utils'
// import { addOrUpdateUrlParams, getUrlParams } from '@vben/utils'
import { useListStore } from '@/store/modules/list'
import ProjectCard from './projectCard.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
  const route = useRoute()
function getUrlParams(){
  return route.query
}
function addOrUpdateUrlParams(newQuery){
  router.push({
    path:route.path,
    query:{...route.query,...newQuery}
  })
}

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
})
const emit = defineEmits(['edit'])

//页面卡片数量
const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
const screenPageSize = caculatePageSizeByWidth(w)

const { page = 1, page_size = screenPageSize, total: preTotal } = getUrlParams()
//loading
const loading = ref('loading')
//空数据图片
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
//华佗用户组应用列表
const huatuoProjectList = ref([])
//当前最新sdk版本号
const latestSDKVersion = ref('2.2.2')
//关闭项目的天数阈值
const closeDays = ref('')

//页码
const total = ref(Number.isNaN(parseInt(preTotal)) ? 0 : parseInt(preTotal))
const currentPage = ref(total.value && total.value > +page! ? +page! : 1) //防止tab切换时page溢出
const pageSize = ref(+page_size!)
// 防止页码超出时不显示
if (page * page_size > preTotal) {
  // TODO message alert
  currentPage.value = 1
}

//搜索序号，防止前面的搜索返回结果覆盖后面的
let lastSearchId = 0
//获取华佗用户组对应应用列表
const getHuatuoProjectList = debounce((page = currentPage.value) => {
  lastSearchId += 1
  const searchId = lastSearchId
  const params = {
    name: props.requestParams.name,
    page,
    page_size: pageSize.value,
    groupid: props.requestParams.groupid,
    type: props.requestParams.projectType,
    saas: props.requestParams.saasType,
    collect_list: props.isStar ? 1 : 0,
    show: props.requestParams.show,
  }
  loading.value = 'loading'
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
    } else {
      total.value = 0
      huatuoProjectList.value = []
      loading.value = 'empty'
    }
    addOrUpdateUrlParams({ ...params, total: total.value })
  })
}, 500)

//收藏/取消应用时，告知父组件
const starProject = starId => {
  if (props.isStar) {
    //若在“我的收藏”列表进行收藏动作，必然为取消收藏，将项目列表对应的卡片删除
    // store.dispatch('actSetForceFlashFlag', 'all');
    listStore.forceFlashFlag.all = !listStore.forceFlashFlag.all
    huatuoProjectList.value = huatuoProjectList.value.filter((item: any) => item.id !== starId)
  } else {
    //若在“全部应用”列表进行收藏动作，告知父组件强制刷新“我的收藏”列表
    // store.dispatch('actSetForceFlashFlag', 'star');
    listStore.forceFlashFlag.star = !listStore.forceFlashFlag.star
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
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20vh;
}
</style>
