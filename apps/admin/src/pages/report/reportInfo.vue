<template>
  <div class="project-board-container">
    <div v-if="projectId" class="grid grid-cols-2 gap-3">
      <div class="chart-container py-0">
        <InfoCard
          boardType="report"
          :projectId="projectId"
          :projectList="projectList"
          :platformType="platformType"
        />
      </div>
      <div class="chart-container py-0">
        <ReportFilterCard />
      </div>
    </div>

    <div v-if="projectId && !loading" class="project-board" id="project-boardReport-content">
      <projectScore />
      <projectBase />
      <projectPerformance />
      <projectStability />
      <div v-if="warnMessage.length">
        <span class="warn-massage">{{ warnMessage }}</span>
      </div>
      <urlTable v-else :type="platformType" />
    </div>
  </div>
</template>

<script setup lang="ts">
//新版质量周报详情页Index
import { ref,  onMounted, provide, h, nextTick } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useGo } from '@vben/hooks';
// import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { formatToDate } from '@vben/utils';
import { getProjectList} from '@/apis/list';
import { getGroupRoleUsers, getProjectById } from '@/apis/bigfish';
import { useReportStore } from '@/store/modules/report'
import {useWatermark} from '@vben/hooks';
import dayjs from 'dayjs';
import moment from 'moment'


import InfoCard from '@/pages/component/infoCard/index.vue';
import ReportFilterCard from '@/pages/component/filterCard/reportFilterCard.vue';

import projectScore from '@/pages/report/total/projectScore.vue';
import projectPerformance from '@/pages/report/total/projectPerformance.vue';
import projectStability from '@/pages/report/total/stability/index.vue';
import projectBase from '@/pages/report/total/projectBase.vue';
import urlTable from '@/pages/report/total/urlTable.vue';
import { getUrlParams } from '@vben/utils';
import { storeToRefs } from 'pinia'

const props = defineProps({
  type: String,
  platformType: String,
  projectName: String,
});
// const { projectid, dimen } = getUrlParams();
const reportStore = useReportStore()
// const store = useStore();
const userid = "xiongbilin"

const { boardInfoState } = storeToRefs(reportStore)
const { projectId: urlProjectId ,dimen } = getUrlParams()
const projectId = ref<undefined | number>(boardInfoState.value.id || +urlProjectId || undefined)

const go = useGo();
const { currentRoute } = useRouter();
//当前选中的项目id
// const projectId = ref(+projectid);
//loading
const loading = ref(true);
//项目列表
const projectList = <any>ref([]);
//项目管理员信息
const adminUsers = <any>ref([]);
const totalAdmins = ref(0);
let admin_uc_group_id = ref(null); //管理该项目的uc_group_id

//当使用手机查看时的警告信息
const warnMessage = ref('');
provide('warnMessage', warnMessage);

onMounted(()=> {
  //请求当前用户组管理的项目列表
  getProjectListByGroup();
  //判断是否为手机查看
  if (isMobile()) {
    warnMessage.value = '推荐使用电脑端查看周报汇总及详情信息';
  }
});

//获取华佗用户组对应应用列表
async function getProjectListByGroup(page = 1, page_size = 100000, type = '') {
  //请求参数
  const params = {
    page,
    page_size,
    type,
  };
  //请求后端数据
  const result = await getProjectList(params);
  if (result.stat === 1 && result.data.projects?.length) {
    projectList.value = result.data.projects;
    //若后台传入最新sdk版本号，则更新当前最新sdk版本号value
    if (result.data.latestSDKVersion) {
      reportStore.commitLatestSDKVersionState(result.data.latestSDKVersion);
    }
  }
  //根据路由中字段匹配项目id
  initProjectId();
}

//判断ua是否为移动端
function isMobile() {
  return navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
}

//处理路由中的项目id
function initProjectId() {
  // const pid = unref(currentRoute).params.projectid;
  let permissionFlag = false;
  // const [firstDate] = unref(currentRoute).params.week.split('&');
  //空id，暂无操作
  if (!projectId.value) {
    loading.value = false;
    return;
  }
  //url中有项目id
  //若该id能在项目列表中找到，设置projectId，将关联数据初始化的操作
  for (const project of projectList.value) {
    if (projectId.value === project.id) {
      permissionFlag = true;
      //判断项目是否关闭
      if (project.close_project === 1) {
        projectClosed(project);
        projectId.value = undefined;
      } else {
        const defaultDate = formatToDate(dayjs().day(-6));
        //url中有 日期of周
        if (!(dimen == 'week')) {
          const firstDateValue = moment(dimen, 'YYYY-MM-DD');
          console.log(firstDateValue);
          //日期解析失败，默认显示上周周报
          if (firstDateValue === 'Invalid date') {
            reportStore.addFilterValue({ start_time: defaultDate });
            go({
              params: {
                projectid: projectId.value,
                week: defaultDate,
              },
            });
            break;
          } else {
            reportStore.addFilterValue({ start_time: dimen });
          }
        } else {
          // projectId.value = +pid;
          reportStore.addFilterValue({ start_time: defaultDate });
        }
      }
    }
  }
  loading.value = false;
  //若在项目列表中没找到此id，则没有该项目的权限，或为不存在的项目
  if (!permissionFlag) {
    noPermission(projectId.value);
    projectId.value = undefined;
  }
  nextTick(() => createWatermark());
}

//当项目状态未关闭时，添加提示
const projectClosed = async project => {
  Modal.warning({
    title: '项目已关闭',
    content: h('div', {}, [
      h('br'),
      h('span', `项目名称：${project.project_name}`),
      h('br'),
      h('br'),
      h('span', '在项目列表中开启项目后方可查看该页面'),
    ]),
  });
};

//当id不在项目列表中时，添加项目无权限信息提示
const noPermission = async pid => {
  // 以下2个语句都可
  const result = await getProjectById(pid);
  // const result = await BigfishApi.getProjectById (unref(currentRoute).params.projectid);
  const { stat, msg, data } = result;
  if (stat !== 1 || msg !== 'success') {
    message.warning('项目权限请求失败');
    return;
  }
  if (!data || !Object.keys(data).length) {
    message.error('不存在的项目');
    return;
  }
  const { uc_group_id, project_name, appid } = data;
  admin_uc_group_id.value = uc_group_id;
  //获取用户组的知音楼信息
  await freshYachId(100000);
  Modal.warning({
    title: '没有该项目的查看权限',
    content: h('div', {}, [
      h('br'),
      h('span', `项目名称：${project_name}`),
      h('br'),
      h('span', `appid：${appid}`),
      h('br'),
      h('span', [
        `管理员：`,
        adminUsers.value.map((user, index) =>
          h(
            'a',
            { key: index, href: user.href },
            `${user.user_name}${index !== adminUsers.value.length - 1 ? '、' : ''}`
          )
        ),
      ]),
    ]),
  });
};

//根据用户组获取用户知音楼信息
const freshYachId = async limit => {
  if (!admin_uc_group_id.value) return;
  const result = await getGroupRoleUsers(admin_uc_group_id.value, 0, limit);
  if (result.stat === 1) {
    adminUsers.value =
      result.data?.users.map(item => ({
        user_name: item.user_name,
        href: `yach://yach.zhiyinlou.com/session/sessionp2p?sessionid=${item.yachid}`,
      })) ?? [];
    totalAdmins.value = result.data?.total ?? 0;
  }
};

// 生成水印
function createWatermark() {
  // const username = store.state.userInfo.name || '';
  const username = userid || '';
  const projectName = props.projectName || '';
  const container = document.getElementById('project-boardReport-content');
  if (container) {
    drawWatermark({
      container: container,
      content: `${props.type ? '华佗' : '小松鼠'}-${projectName}-${username}`,
      // rotate默认30度，因此长宽比为1.732:1能最大程度利用空间（容纳最多字符）
      width: '400px',
      height: '300px',
      font: '7.5px Microsoft Yahei Light',
    });
  }
}
</script>

<style lang="scss" scoped>
:deep(.select-input) {
  .ant-select-selection-search-input {
    border-color: #fff;
  }
}
.project-board-container {
  overflow: hidden;
  min-height: 50vh;
  .project-board {
    padding: 2%;
    margin: 12px 0;
    background-color: white;
  }
  .warn-massage {
    font-size: 140%;
    color: #ff0000;
  }
}
</style>
