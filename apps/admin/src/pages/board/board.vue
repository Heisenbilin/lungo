<template>
  <div v-if="loading" class="flex min-h-200 justify-center items-center">
    <a-spin size="large" />
  </div>
  <div v-else>
    <template v-if="projectId">
      <div class="grid grid-cols-2 gap-3">
        <div class="chart-container">
          <InfoCard :projectId="projectId" :projectList="projectList" :platformType="props.platformType" />
        </div>
        <div class="chart-container">
          <FilterCard />
        </div>
      </div>
      <div v-if="boardLoading" class="flex min-h-150 justify-center items-center">
        <a-spin size="large" />
      </div>
      <Content v-else :platformType="props.platformType" />
    </template>
    <a-empty class="my-28" v-else>
      <template #description>
        <div>
          <a target="blink" href="http://app.xesv5.com/doc/pages/fedata/">质量监控项目接入指南</a>
        </div>
      </template>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
//新版性能监测详情页Index
import { ref, unref, onMounted, h, computed } from "vue";
import { message, Modal } from "ant-design-vue";
import { useRouter } from "vue-router";
import { getProjectById, getGroupRoleUsers } from "@/apis/bigfish";
import { getProjectList } from "@/apis/list";
import { useBoardStore } from "@/store/modules/board";

import InfoCard from "../component/infoCard/index.vue";
import FilterCard from "../component/filterCard/index.vue";
import Content from "./component/content.vue";
import { getUrlParams } from "@vben/utils";

const boardStore = useBoardStore();

const props = defineProps({
  platformType: String,
});

const { currentRoute } = useRouter();
//当前选中的项目id
const projectId = ref<undefined | number>(+getUrlParams().projectId || undefined);

console.log(projectId.value)
//loading
const loading = ref(true);
const boardLoading = computed(() => boardStore.loadingState);
//项目列表
const projectList = ref<any[]>([]);
//项目管理员信息
const adminUsers = ref<any[]>([]);
const totalAdmins = ref(0);
const admin_uc_group_id = ref(null); //管理该项目的uc_group_id

onMounted(async () => {
  //请求当前用户组管理的项目列表
  getProjectListByGroup();
});

//获取华佗用户组对应应用列表
async function getProjectListByGroup(page = 1, page_size = 100000, type = "") {
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
      boardStore.commitLatestSDKVersionState(result.data.latestSDKVersion);
    }
  }
  //根据路由中字段匹配项目id
  initProjectId();
}

//处理路由中的项目id
function initProjectId() {
  let permissionFlag = false;
  //空id，暂无操作
  if (!projectId.value) {
    loading.value = false;
  }
  //url中有项目id
  else {
    //若该id能在项目列表中找到，设置projectId，将关联数据初始化的操作
    for (const project of projectList.value) {
      if (projectId.value === project.id) {
        permissionFlag = true;
        //判断项目是否关闭
        if (project.close_project === 1) {
          projectClosed(project);
          projectId.value = undefined;
        }
        break;
      }
    }
    loading.value = false;
    //若在项目列表中没找到此id，则没有该项目的权限，或为不存在的项目
    if (!permissionFlag) {
      noPermission(projectId.value);
      projectId.value = undefined;
    }
  }
}

//当项目状态未关闭时，添加提示
const projectClosed = async (project) => {
  Modal.warning({
    title: "项目已关闭",
    content: h("div", {}, [
      h("br"),
      h("span", `项目名称：${project.project_name}`),
      h("br"),
      h("br"),
      h("span", "在项目列表中开启项目后方可查看该页面"),
    ]),
  });
};

//当id不在项目列表中时，添加项目无权限信息提示
const noPermission = async (pid) => {
  // 以下2个语句都可
  const result = await getProjectById(pid);
  // const result = await BigfishApi.getProjectById (unref(currentRoute).params.projectid);
  const { stat, msg, data } = result;
  if (stat !== 1 || msg !== "success") {
    message.warning("项目权限请求失败");
    return;
  }
  if (!data || !Object.keys(data).length) {
    message.error("不存在的项目");
    return;
  }
  const { uc_group_id, project_name, appid } = data;
  admin_uc_group_id.value = uc_group_id;
  //获取用户组的知音楼信息
  await freshYachId(100000);
  Modal.warning({
    title: "没有该项目的查看权限",
    content: h("div", {}, [
      h("br"),
      h("span", `项目名称：${project_name}`),
      h("br"),
      h("span", `appid：${appid}`),
      h("br"),
      h("span", [
        `管理员：`,
        adminUsers.value.map((user, index) =>
          h(
            "a",
            { key: index, href: user.href },
            `${user.user_name}${index !== adminUsers.value.length - 1 ? "、" : ""}`
          )
        ),
      ]),
    ]),
  });
};

//根据用户组获取用户知音楼信息
const freshYachId = async (limit) => {
  if (!admin_uc_group_id.value) return;
  const result = await getGroupRoleUsers(admin_uc_group_id.value, 0, limit);
  if (result.stat === 1) {
    adminUsers.value =
      result.data?.users.map((item) => ({
        user_name: item.user_name,
        href: `yach://yach.zhiyinlou.com/session/sessionp2p?sessionid=${item.yachid}`,
      })) ?? [];
    totalAdmins.value = result.data?.total ?? 0;
  }
};
</script>

<style lang="scss" scoped>
:deep(.ant-card) {
  border-radius: 0.5rem;
}
</style>
