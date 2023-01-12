<template>
  <a-card class="h-full" :bordered="false">
    <template #title>
      <div class="h-7">
        <span class="mr-4">项目信息</span>
        <a-select
          v-model:value="projectId"
          placeholder="请选择项目名称"
          style="width: 300px"
          showSearch
          optionFilterProp="label"
        >
          <a-select-option
            v-for="item of projectList"
            :key="item.id"
            :label="item.project_name"
            :value="item.id"
          >
            <div>
              <a-tag color="red" v-if="item.saas === 'yes'">学科</a-tag>
              <a-tag color="blue" v-else>素质</a-tag>
              {{ item.project_name }}
            </div>
          </a-select-option>
        </a-select>
      </div>
    </template>
    <div v-if="projectInfo.id" class="flex gap-3 flex-wrap">
      <InfoTag title="appid">
        <template #content>
          <a-tooltip title="点击跳转本项目的kibana数据看板">
            <a :href="jumpKibanaURL" target="_blank">{{ projectInfo.appid }}</a>
          </a-tooltip>
        </template>
      </InfoTag>
      <InfoTag title="eventid" :content="projectInfo.eventid" />
      <InfoTag title="SDK版本">
        <template #content>
          <SDKVersion :currentSDKVersion="projectInfo.sdk_version" />
        </template>
      </InfoTag>
      <InfoTag
        title="接入方式"
        :content="
          projectInfo.access_mode ? (projectInfo.access_mode === 'sdk' ? 'NPM' : 'CDN') : '未知'
        "
      />
      <InfoTag title="创建时间" :content="moment(projectInfo.create_time).format('YY.MM.DD')" />
      <InfoTag title="管理员" v-if="adminUsers.length">
        <template #content>
          <a v-for="(user, i) in adminUsers" :key="i" :href="user.href">
            {{ user.user_name }}{{ i !== adminUsers.length - 1 ? '、' : '' }}
          </a>
          <a v-if="adminUsers.length < totalAdmins" @click="freshYachId(1000)">...</a>
        </template>
      </InfoTag>
      <InfoTag>
        <template #content>
          <a
            class="link"
            @click="currentInstance.ctx.$refs.alarmSetting.showModal()"
            color="warning"
          >
            <AlertTwoTone twoToneColor="#d4542d" key="alarm" class="mr-2" /> 预警设置
          </a>
        </template>
      </InfoTag>
      <InfoTag v-if="boardType !== 'panel'">
        <template #content>
          <router-link :to="boardDataUrl">
            <span @click="() => useStoreProject(projectInfo, 'panel', boardType)">
              <PieChartOutlined style="color: #f77f00" key="data" class="mr-2" /> 数据大盘
            </span>
          </router-link>
        </template>
      </InfoTag>
      <InfoTag v-if="boardType !== 'board'">
        <template #content>
          <router-link :to="boardUrl">
            <span @click="() => useStoreProject(projectInfo, 'board', boardType)">
              <AreaChartOutlined style="color: #7ed591" key="board" class="mr-2" /> 质量监控
            </span>
          </router-link>
        </template>
      </InfoTag>
      <InfoTag v-if="boardType !== 'report' && projectInfo.appid !== '1001970'">
        <template #content>
          <router-link :to="reportUrl">
            <span @click="() => useStoreProject(projectInfo, 'report', boardType)">
              <FundOutlined style="color: #720096" key="report" class="mr-2" /> 质量周报
            </span>
          </router-link>
        </template>
      </InfoTag>
    </div>
  </a-card>
  <AlarmSetting ref="alarmSetting" :projectId="projectInfo.id" :ucGroupId="admin_uc_group_id" />
</template>

<script setup lang="ts">
// 质量监控页 项目卡片组件
import { ref, computed, watch, getCurrentInstance, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useBoardStore } from '@/store/modules/board'
import { useReportStore } from '@/store/modules/report'
import { useBoardDataStore } from '@/store/modules/panel'
import {
  AlertTwoTone,
  FundOutlined,
  PieChartOutlined,
  AreaChartOutlined,
} from '@ant-design/icons-vue'
import { kibanaHref } from '../logDetail/util'
import { getGroupRoleUsers } from '@/apis/bigfish'
import { getKibanaTopicId } from '@/apis/board/logCenter'
import moment from 'moment'

import SDKVersion from '../sdkVersion.vue'
import AlarmSetting from '../alarm/alarmSetting.vue'
import InfoTag from './infoTag.vue'
import { useLinkToUrl, useStoreProject } from '@/hooks/board/useLink'
import { storeToRefs } from 'pinia'
import { addOrUpdateUrlParams, getUrlParams } from '@vben/utils'
import { MonitorPage } from '@vben/constants'

const boardStore = useBoardStore()
const reportStore = useReportStore()
const boardDataStore = useBoardDataStore()

const props = defineProps({
  projectList: {
    type: Array as PropType<any[]>,
    required: true,
  },
  platformType: {
    type: String,
  },
  boardType: {
    type: String as PropType<MonitorPage>,
    required: true,
  },
})

const store =
  props.boardType === 'board'
    ? boardStore
    : props.boardType === 'panel'
    ? boardDataStore
    : reportStore

// 当前选中项目信息
const { boardInfoState: projectInfo } = storeToRefs(store)
const { projectId: urlProjectId } = getUrlParams()
const projectId = ref<number | string>(projectInfo.value.id || +urlProjectId || '请选择应用')

// 用于sourcemap详情的topicid信息
const topicId = ref('')

// 跳转kibana链接
const jumpKibanaURL = computed(
  () =>
    `${kibanaHref}/app/kibana#/discover?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'${topicId.value}',key:data.eventid.keyword,negate:!f,params:(query:'${projectInfo.value.eventid}',type:phrase),type:phrase,value:'${projectInfo.value.eventid}'),query:(match:(data.eventid.keyword:(query:'${projectInfo.value.eventid}',type:phrase))))),refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(columns:!(_source),index:'${topicId.value}',interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))`,
)

let currentInstance: any = ''
onMounted(() => {
  currentInstance = getCurrentInstance()
})

//点击卡片跳转的路由
const boardUrl = useLinkToUrl(projectInfo.value.id, 'board')
//点击质量周报按钮跳转的路由
const reportUrl = useLinkToUrl(projectInfo.value.id, 'report')
//点击数据大盘按钮跳转的路由
const boardDataUrl = useLinkToUrl(projectInfo.value.id, 'panel')

//项目管理员信息<
const admin_uc_group_id = ref<number | undefined>(undefined) // 管理该项目的uc_group_id
const adminUsers = ref<any[]>([]) // 管理员们
const totalAdmins = ref(0) // 全部管理员数量

//根据用户组获取用户知音楼信息
const freshYachId = async (limit = 3, group_id = admin_uc_group_id.value) => {
  if (!group_id) return
  if (admin_uc_group_id.value !== group_id) admin_uc_group_id.value = group_id
  const result = await getGroupRoleUsers(group_id, 0, limit)
  if (result?.stat === 1) {
    adminUsers.value =
      result.data?.users.map(item => ({
        user_name: item.user_name,
        href: `yach://yach.zhiyinlou.com/session/sessionp2p?sessionid=${item.yachid}`,
      })) ?? []
    totalAdmins.value = result.data?.total ?? 0
  }
}

//根据appId获取topicId
// 接口文档 https://wiki.zhiyinlou.com/pages/viewpage.action?pageId=120097310
async function getTopicId(appId, isSaas) {
  if (!appId) {
    return
  }
  const saasFlag = isSaas === 'yes' ? 'xk-' : ''
  const href = `https://app.xesv5.com/logcenterbigdata/api/v1/kibana/index-pattern/title/basiclog-${saasFlag}sys_${appId}-*`
  const res = await getKibanaTopicId(href)
  if (res.stat === 1 && res.data) {
    topicId.value = res.data
    store.commitTopicIdState(res.data)
  } else {
    message.error(res.msg)
  }
}

// 切换项目
watch(
  () => [projectId.value, props.projectList],
  () => {
    const newId = projectId.value
    if (!props.projectList.length || !newId) return
    for (const project of props.projectList) {
      if (project.id === newId) {
        if (newId !== projectInfo.value.id) {
          // 项目信息存入store供其他组件调用
          store.initStateValue({ ...project, noInitFilter: true })
        }
        addOrUpdateUrlParams({ projectId: newId })
        getTopicId(project.appid, project.saas)
        // 重新获取创建者知音楼用户信息
        freshYachId(undefined, project.uc_group_id)
      }
    }
  },
  { immediate: true },
)
</script>
