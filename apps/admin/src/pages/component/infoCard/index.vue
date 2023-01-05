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
    <div v-if="loading" class="flex min-h-40 justify-center items-center">
      <a-spin size="large" />
    </div>
    <div v-else-if="projectId" class="flex gap-3 flex-wrap">
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
          <a class="link" @click="$refs.alarmSetting.showModal()" color="warning">
            <AlertTwoTone twoToneColor="#d4542d" key="alarm" class="mr-2" /> 预警设置
          </a>
        </template>
      </InfoTag>
      <InfoTag v-if="props.boardType !== 'data'">
        <template #content>
          <router-link :to="boardDataUrl">
            <PieChartOutlined style="color: #f77f00" key="data" class="mr-2" /> 数据大盘
          </router-link>
        </template>
      </InfoTag>
      <InfoTag v-if="props.boardType !== 'general'">
        <template #content>
          <router-link :to="boardUrl">
            <AreaChartOutlined style="color: #7ed591" key="board" class="mr-2" /> 质量监控
          </router-link>
        </template>
      </InfoTag>
      <InfoTag v-if="props.boardType !== 'report' && projectInfo.appid !== '1001970'">
        <template #content>
          <router-link :to="reportUrl">
            <FundOutlined style="color: #720096" key="report" class="mr-2" /> 质量周报
          </router-link>
        </template>
      </InfoTag>
    </div>
  </a-card>
  <AlarmSetting ref="alarmSetting" :project-id="projectId" :uc-group-id="admin_uc_group_id" />
</template>

<script setup>
// 质量监控页 项目卡片组件
import { ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
// import { useGo } from '/@/hooks/web/usePage';
import { boardStore, boardDataStore, reportStore } from '/@/store/modules/board';
import {
  AlertTwoTone,
  FundOutlined,
  PieChartOutlined,
  AreaChartOutlined,
} from '@ant-design/icons-vue';
import { kibanaHref } from '/@/components/boardNew/component/logDetail/util';

import { huatuoApis } from '/@/api/huatuo';
import API from '/@/api/board/logCenter';
import moment from 'moment';

import SDKVersion from '/@/components/boardNew/component/sdkVersion.vue';
import AlarmSetting from '/@/views/pages/projectBoard/alarm/alarm-setting.vue';
import InfoTag from './infoTag.vue';

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
  projectList: {
    type: Array,
    required: true,
  },
  platformType: {
    type: String,
  },
  boardType: {
    type: String,
    default: 'general',
  },
});

const store =
  props.boardType === 'general'
    ? boardStore
    : props.boardType === 'data'
    ? boardDataStore
    : reportStore;

const projectId = ref(props.projectId);

// loading
const loading = computed(() => store.getLoadingState);

// 当前选中项目信息
const projectInfo = ref({});

// 用于sourcemap详情的topicid信息
const topicId = ref('');

// 跳转kibana链接
const jumpKibanaURL = computed(
  () =>
    `${kibanaHref}/app/kibana#/discover?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:'${props.topicId}',key:data.eventid.keyword,negate:!f,params:(query:'${projectInfo.value.eventid}',type:phrase),type:phrase,value:'${projectInfo.value.eventid}'),query:(match:(data.eventid.keyword:(query:'${projectInfo.value.eventid}',type:phrase))))),refreshInterval:(pause:!t,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(columns:!(_source),index:'${props.topicId}',interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))`
);

//点击数据大盘按钮跳转的路由
const boardDataUrl = computed(() => {
  if (!props.platformType) {
    return `/projectboard/dataBoard/${projectId.value}`;
  }
  return `/huatuo/data/${projectId.value}`;
});

//点击质量监控按钮跳转的路由
const boardUrl = computed(() => {
  if (!props.platformType) {
    return `/projectboard/boardInfo/${projectId.value}`;
  }
  return `/huatuo/board/${projectId.value}`;
});

//点击质量周报按钮跳转的路由
const reportUrl = computed(() => {
  if (!props.platformType) {
    return `/projectboard/qcEntry${projectId.value}/:week`;
  }
  return `/huatuo/report/${projectId.value}/:week`;
});

//项目管理员信息
const admin_uc_group_id = ref(null); // 管理该项目的uc_group_id
const adminUsers = ref([]); // 管理员们
const totalAdmins = ref(0); // 全部管理员数量

//根据用户组获取用户知音楼信息
const freshYachId = async (limit = 3, group_id = admin_uc_group_id.value) => {
  if (!group_id) return;
  if (admin_uc_group_id.value !== group_id) admin_uc_group_id.value = group_id;
  const result = await huatuoApis.getGroupRoleUsers(group_id, 0, limit);
  if (result?.stat === 1) {
    adminUsers.value =
      result.data?.users.map(item => ({
        user_name: item.user_name,
        href: `yach://yach.zhiyinlou.com/session/sessionp2p?sessionid=${item.yachid}`,
      })) ?? [];
    totalAdmins.value = result.data?.total ?? 0;
  }
};

//根据appId获取topicId
// 接口文档 https://wiki.zhiyinlou.com/pages/viewpage.action?pageId=120097310
async function getTopicId(appId, isSaas) {
  if (!appId) {
    return;
  }
  const saasFlag = isSaas === 'yes' ? 'xk-' : '';
  const href = `https://app.xesv5.com/logcenterbigdata/api/v1/kibana/index-pattern/title/basiclog-${saasFlag}sys_${appId}-*`;
  const res = await API.getTopicId(href);
  if (res.stat === 1 && res.data) {
    topicId.value = res.data;
    store.commitTopicIdState(res.data);
  } else {
    message.error(res.msg);
  }
}

// 展现日志手动上报
const uploadLoadMsg = project => {
  window.__XES_LOG__.loadMsg({
    projectName: project.project_name,
    appid: project.appid,
    eventid: project.eventid,
    addUser: project.add_user,
  });
};

// 切换项目
watch(
  projectId,
  (newId, oldId) => {
    for (const project of props.projectList) {
      if (project.id === newId) {
        // 重新获取TopicID
        store.commitLoadingState(true);
        if (oldId) window.history.pushState({}, 0, window.location.href.replace(oldId, newId));
        getTopicId(project.appid, project.saas);
        // 重新获取创建者知音楼用户信息
        freshYachId(undefined, project.uc_group_id);
        // 项目信息存入state
        projectInfo.value = project;
        // 项目信息存入store供其他组件调用
        store.initStateValue({ ...project, noInitFilter: true });
        store.commitLoadingState(false);
        // 展现日志手动上报
        uploadLoadMsg(project);
      }
    }
  },
  { immediate: true }
);

//项目Select框变更处理，路由跳转
// const go = useGo();
// function changeProject(value) {
//   go({
//     params: {
//       projectid: +value,
//     },
//   });
// }
</script>
