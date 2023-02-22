<template>
  <a-tabs v-model:activeKey="activeKey">
    <template #rightExtra>
      <div class="flex justify-end h-8 gap-3 2xl:gap-2 items-center" id="projectList">
        <div class="flex gap-3 2xl:gap-6">
          <a-select v-model:value="projectType" style="min-width: 130px">
            <a-select-option :value="''">所有应用</a-select-option>
            <a-select-option :value="0">非编辑器应用</a-select-option>
            <a-select-option :value="1">编辑器应用</a-select-option>
          </a-select>
          <a-select v-model:value="saasType" style="min-width: 110px">
            <a-select-option :value="''">学科&素质</a-select-option>
            <a-select-option :value="'yes'">学科</a-select-option>
            <a-select-option :value="'no'">素质</a-select-option>
          </a-select>

          <a-tooltip placement="top">
            <template v-if="currentGroup" #title>
              {{ currentGroup.group_name.length > 10 ? currentGroup.group_name : '' }}
            </template>
            <a-select
              v-model:value="groupId"
              allowClear
              showSearch
              :filterOption="filterOption"
              style="width: 200px"
            >
              <a-select-option value="" key="全部用户组" title="全部用户组">
                全部用户组
              </a-select-option>

              <a-select-option
                v-for="item in groups"
                :value="item.group_id"
                :key="item.group_id"
                :title="item.group_name"
              >
                {{ item.group_name }}
              </a-select-option>
            </a-select>
          </a-tooltip>
          <a-input-search
            v-model:value="searchValue"
            style="width: 200px"
            placeholder="输入名称/appid/eventid"
            @keydown="onInputKeyDown"
          />
        </div>
        <div>
          <span class="pr-1">数据维度:</span>
          <a-radio-group v-model:value="dimension">
            <a-radio-button value="week">周</a-radio-button>
            <a-radio-button value="day">天</a-radio-button>
          </a-radio-group>
        </div>
        <a-button
          type="primary"
          @click="checkProject"
          v-if="userStore.isAdminUser()"
          :loading="checking"
        >
          巡检
        </a-button>
        <a-button type="primary" @click="addProject">创建应用</a-button>
        <div>
          <a-tooltip title="列表展示">
            <UnorderedListOutlined
              :style="{
                color: state === 'table' ? 'rgba(43, 96, 179)' : 'gray',
                fontSize: '20px',
              }"
              @click="() => handleToggleShow('table')"
            />
          </a-tooltip>
          <a-tooltip title="卡片展示">
            <AppstoreOutlined
              :style="{
                color: state === 'card' ? 'rgba(43, 96, 179)' : 'gray',
                fontSize: '20px',
                padding: '10px',
              }"
              @click="() => handleToggleShow('card')"
            />
          </a-tooltip>
        </div>
      </div>
    </template>
    <a-tab-pane key="all" tab="应用列表">
      <div v-if="state === 'card'">
        <cardList
          :requestParams="{
            name: searchValue.trim(),
            projectType: projectType,
            saasType: saasType,
            groupid: groupId,
            show: state,
          }"
          :forceFlash="forceFlashFlag.all"
          :isStar="false"
          @edit="editProjectInfo"
        />
      </div>
      <div v-else>
        <tableList
          :requestParams="{
            name: searchValue.trim(),
            projectType: projectType,
            saasType: saasType,
            groupid: groupId,
            show: state,
          }"
          :forceFlash="forceFlashFlag.all"
          :isStar="false"
          @edit="editProjectInfo"
        />
      </div>
    </a-tab-pane>
    <a-tab-pane key="star" tab="我的收藏">
      <div v-if="state === 'card'">
        <cardList
          :requestParams="{
            name: searchValue.trim(),
            projectType: projectType,
            saasType: saasType,
            groupid: groupId,
            show: state,
          }"
          :forceFlash="forceFlashFlag.star"
          :isStar="true"
          @edit="editProjectInfo"
        />
      </div>
      <div v-else>
        <tableList
          :requestParams="{
            name: searchValue.trim(),
            projectType: projectType,
            saasType: saasType,
            groupid: groupId,
            show: state,
          }"
          :forceFlash="forceFlashFlag.star"
          :isStar="true"
          @edit="editProjectInfo"
        />
      </div>
    </a-tab-pane>
  </a-tabs>
  <addProjectModal
    v-if="addProjectVisible"
    v-model:visible="addProjectVisible"
    :editProjectId="editProjectId"
    @flash="forceFlashList"
  />
  <uc-group-modal />
</template>
<script setup lang="ts">
import { ref, watch, h, computed, provide } from 'vue'
import { checkProjectData } from '@/apis/list'
import { message, Modal } from 'ant-design-vue'
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
import { useListStore } from '@/store/modules/list'
import { useUserStore } from '@/store/user'
import { storeToRefs } from '@vben/stores'
import cardList from './cardList/index.vue'
import tableList from './tableList/index.vue'
import addProjectModal from './addProject/addProjectDrawer.vue'
import UcGroupModal from './ucGroupModal.vue'
import dayjs from 'dayjs'
import { addOrUpdateQuery, getQuery } from '@vben/router'

const {
  tabKey = 'all',
  name = '',
  type = '0',
  saas = '',
  dimen = 'week',
  groupid = '',
  show = 'table',
} = getQuery()

const listStore = useListStore()
const userStore = useUserStore()

const { forceFlashFlag } = storeToRefs(listStore)
// 项目初始展示形态
let state = ref(show)
// 切换颜色以及展示组件
function handleToggleShow(value) {
  if (value == 'card') {
    state.value = 'card'
  } else {
    state.value = 'table'
  }
}

//新增/编辑项目后，强制刷新列表
const forceFlashList = () => {
  if (!editProjectId.value) {
    //若为新增项目，跳转到"全部应用"Tab
    activeKey.value = 'all'
    listStore.forceFlashFlag['all'] = !listStore.forceFlashFlag['all']
    // store.dispatch('actSetForceFlashFlag', activeKey.value);
  } else {
    //若为编辑项目，刷新两个列表
    listStore.forceFlashFlag['all'] = !listStore.forceFlashFlag['all']
    listStore.forceFlashFlag['star'] = !listStore.forceFlashFlag['star']
    // store.dispatch('actSetForceFlashFlag', 'all');
    // store.dispatch('actSetForceFlashFlag', 'star');
  }
}

// 获取UCGroups
// store.dispatch('actGetUCGroups');
listStore.requestUCGroups()
const groupId = ref(+groupid! === 0 ? '' : +groupid!)
const { ucGroups: groups } = storeToRefs(listStore)
// const groups = computed(() => store.state.ucGroups);

const currentGroup = computed(
  () => groups.value.find(item => item.group_id === groupId.value) || { group_name: '全部用户组' },
)

//选择用户组时，用户自己输入时的搜索关键字
function filterOption(inputValue, options) {
  return options.children[0].children.includes(inputValue)
}
//tabKey
const activeKey = ref(tabKey)

//监听tabKey变化，更新url Parameter
watch(activeKey, val => addOrUpdateQuery({ tabKey: val }))

//时间范围
const startTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
const startWeek = dayjs().startOf('day').subtract(6, 'd').format('YYYY-MM-DD HH:mm:ss')
const endTime = dayjs()
  .minute(10 * Math.floor(dayjs().minute() / 10))
  .second(0)
  .format('YYYY-MM-DD HH:mm:ss')
// provide('startTime', dimension.value === 'week' ? startWeek : startTime)
// provide('endTime', endTime)

//对比维度
const dimension = ref<'week' | 'day'>(dimen as 'week' | 'day')

// 开始时间与结束时间存入listStore
listStore.startTime = dimension.value === 'week' ? startWeek : startTime
listStore.endTime = endTime

//监听数据维度变化，更新store
watch(
  dimension,
  val => {
    listStore.dimension = val
    listStore.startTime = val === 'week' ? startWeek : startTime
    addOrUpdateQuery({ dimen: val })
  },
  { immediate: true },
)

//创建应用弹窗可视性
const addProjectVisible = ref(false)
//编辑项目的项目ID
const editProjectId = ref('')
//搜索框value
const searchValue = ref<string>(name as string)

//应用类型
const projectType = ref(+type!)
//Saas类型
const saasType = ref(saas)

//处理路由中的项目
const handleEditParams = () => {
  const { openUpdateDialog, project_id } = getQuery()
  if (+openUpdateDialog! === 1 && project_id) {
    //判断是否有该项目权限、且项目是否是开启中
    // let hasAuthority = false;
    // for (const project of huatuoProjectList.value) {
    //   if (+project_id === project.id) {
    //     hasAuthority = true;
    // if (project.close_project === 1) {
    //   message.error('项目已关闭');
    //   window.history.replaceState({}, 0, window.location.href.split('?openUpdateDialog')[0]);
    // } else {
    editProjectInfo(project_id)
    // }
    //   }
    // }
    // if (!hasAuthority) {
    //   message.error('无该项目的查看权限！');
    // }
  }
}

const editProjectInfo = project_id => {
  const { openUpdateDialog } = getQuery()
  if (+openUpdateDialog! !== 1) {
    addOrUpdateQuery({ openUpdateDialog: 1, project_id: project_id })
  }
  editProjectId.value = `${project_id}`
  addProjectVisible.value = true
}
handleEditParams()

//添加应用处理
function addProject() {
  editProjectId.value = ''
  addProjectVisible.value = true
}

//项目巡检loading
const checking = ref(false)

//巡检项目数据
const checkProject = async () => {
  checking.value = true
  message.success('巡检中，请勿离开此页面！')
  const result: any = await checkProjectData()
  if (result.stat === 1) {
    Modal.success({
      title: '巡检成功',
      content: h('div', {}, [
        h('a', { href: result.data.ossUrl, target: '_blank' }, '点击查看无数据项目统计表'),
      ]),
    })
  } else {
    message.error('巡检失败')
  }
  checking.value = false
}

// 控制action的样式
const styles = ref({
  floatAction: 'right',
})
// 监听窗口size变化
window.addEventListener('resize', () => {
  if (document.body.clientWidth < 1350) {
    styles.value.floatAction = 'none'
  } else {
    styles.value.floatAction = 'right'
  }
})
// 阻止input框中冒泡的tab默认键盘事件
const onInputKeyDown = e => {
  e.stopPropagation()
}
</script>

<style scoped>
:deep(.ant-tabs-extra-content) {
  float: v-bind('styles.floatAction') !important;
}
</style>
