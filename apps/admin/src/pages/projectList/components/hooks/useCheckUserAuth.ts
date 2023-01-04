import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode, h, reactive } from "vue";
// import { huatuoApis } from "/@/api/huatuo";
import {
  checkWeeklyReportAuth as checkReportAuth,
  removeWeeklyReportAuth as removeReportAuth,
} from "@/apis/projectList";
import {checkAlarmAuth as checkAuth, removeAlarmAuth as removeAAuth} from "@/apis/alarm";
// import { useStore } from 'vuex';

export const useCheckUserAuth = () => {
  const payload = reactive({
    weeklyReport: [],
    alarm: [],
  });
  // const store = useStore();

  /**
   * 检查用户质量周报权限，有被关联的权限返回 true，没有被关联的权限返回 false
   */
  const checkWeeklyReportAuth = async (group_id, user_account) => {
    const { stat, data } = await checkReportAuth(group_id, user_account);
    if (stat) {
      payload.weeklyReport = data;
      return data.length > 0;
    } else {
      return false;
    }
  };

  /**
   * 移除质量周报权限
   */
  const removeWeeklyReportAuth = async (group_id, user_account) => {
    const { stat } = await removeReportAuth(
      group_id,
      user_account,
      // "xiongbilin" //'store.state.userInfo.account'
    );
    return stat === 1;
  };

  /**
   * 检查监控预警权限
   */
  const checkAlarmAuth = async (group_id, workcode) => {
    const { stat, data } = await checkAuth(group_id, workcode);
    if (stat) {
      payload.alarm = data.map((item) => {
        item.project_name = item.alarm_name;
        return item;
      });
      return data.length > 0;
    } else {
      return false;
    }
  };

  /**
   * 移除质量周报权限
   */
  const removeAlarmAuth = async (group_id, workcode) => {
    const { stat } = await removeAuth(group_id, workcode);
    return stat === 1;
  };

  /**
   * 删除用户前的操作
   */
  const beforeDeleteUser = (group_id, { user_account, workcode }) => {
    return new Promise(async (resolve, reject) => {
      const result = await Promise.all([
        checkWeeklyReportAuth(group_id, user_account),
        checkAlarmAuth(group_id, workcode),
      ]);
      if (result.some((item) => item)) {
        // 如果有正在被关联的权限则弹窗，否则直接删除
        showConfirm(resolve, reject, { group_id, user_account, workcode }, payload);
      } else {
        resolve(true);
      }
    });
  };

  /**
   * 生成项目列表
   */
  const generateProjects = (projects, title) => {
    const projectList = projects.map((item) =>
      h("div", { class: "text-xs" }, `${item.project_name}`)
    );
    if (projectList.length) {
      projectList.unshift(h("p", { class: "title" }, title));
    }
    return projectList;
  };

  /**
   * 显示弹窗
   */
  const showConfirm = (resolve, reject, params, payload) => {
    const { group_id, user_account, workcode } = params;
    const { weeklyReport, alarm } = payload;
    const weeklyReportList = generateProjects(weeklyReport, "接收质量周报权限：");
    const alarmList = generateProjects(alarm, "接收监控预警权限：");

    Modal.confirm({
      title: "提示：",
      icon: createVNode(ExclamationCircleOutlined),
      content: h("div", {}, [
        h("p", { class: "tips" }, "该用户有以下权限正在被关联"),
        ...weeklyReportList,
        ...alarmList,
        h("p", { class: "tips pt-10px" }, "是否移除权限并删除？"),
      ]),
      async onOk() {
        const value = await removeAAuth(group_id, { user_account, workcode });
        if (value) {
          resolve(value);
        } else {
          reject(value);
        }
      },
      onCancel() {
        reject(false);
      },
    });
  };

  /**
   * 移除权限
   */
  const removeAuth = async (group_id, { user_account, workcode }) => {
    try {
      const res = await Promise.all([
        removeWeeklyReportAuth(group_id, user_account),
        removeAlarmAuth(group_id, workcode),
      ]);
      return res.every(Boolean);
    } catch (error) {
      return false;
    }
  };
  return {
    beforeDeleteUser,
  };
};
