import { buildUUID } from "@vben/utils";
import { changeFormFormat } from "@vben/utils";
import { checkLightHouseAuth } from "@/apis/auth";
import { message } from "ant-design-vue";
import { handleDate } from "./date";

const REG_SPACE = /[ ]/g;

const addAuthField = (authForm) => {
  authForm.fields.push({
    index: buildUUID(),
    field: "",
    key: "",
    value: "",
  });
};

const removeAuthField = (authForm, index) => {
  authForm.fields = authForm.fields.filter((item) => item.index != index);
};

const selectFields = [
  { value: "header" },
  { value: "query" },
  { value: "cookie" },
  { value: "localStorage" },
];

const clearFieldsSpace = (authForm, index, type) => {
  authForm.fields[index][type] = (authForm.fields[index][type] + "").replace(REG_SPACE, "");
};

const checkAuth = async (formRef, auth_info, project_url, form) => {
  try {
    const nameList: any[] = [];
    auth_info.authForm.fields.forEach((_, index) => {
      nameList.push(
        ["auth_info", "authForm", "fields", index, "field"],
        ["auth_info", "authForm", "fields", index, "key"],
        ["auth_info", "authForm", "fields", index, "value"],
        ["auth_info", "project_url"]
      );
    });
    await formRef.validateFields(nameList);
    auth_info.checkLoading = true;
    const auth_msg = JSON.stringify(changeFormFormat(auth_info.authForm.fields));
    form.auth_info_original_auth_msg = auth_msg;
    const { data: res } = await checkLightHouseAuth({ auth_msg, project_url });
    const { data = {} } = res;
    // console.log('data', data);
    if (data.status === 0) {
      auth_info.authForm.last_check_status = 1;
      auth_info.authForm.last_check_statusTxt = "参数有效";
      auth_info.authForm.last_check_time = new Date();
      auth_info.authForm.last_check_time_txt = handleDate({
        time: auth_info.authForm.last_check_time,
        type: "YY-MM-DD HH-mm-ss",
      });
      message.success(data.msg);
    } else if (data.status === 1) {
      auth_info.authForm.last_check_status = 2;
      auth_info.authForm.last_check_statusTxt = "参数无效";
      auth_info.authForm.last_check_time = new Date();
      auth_info.authForm.last_check_time_txt = handleDate({
        time: auth_info.authForm.last_check_time,
        type: "YY-MM-DD HH-mm-ss",
      });
      message.error(data.msg);
    } else {
      message.error(data.msg);
    }
  } catch (error) {
    console.log("checkAuth", error);
    if (error) {
      auth_info.authForm.last_check_status = 3;
      auth_info.authForm.last_check_statusTxt = "检测异常";
      auth_info.authForm.last_check_time = new Date();
      auth_info.authForm.last_check_time_txt = handleDate({
        time: auth_info.authForm.last_check_time,
        type: "YY-MM-DD HH-mm-ss",
      });
    }
  }

  auth_info.checkLoading = false;
};

export const useAuth = () => {
  return {
    addAuthField,
    removeAuthField,
    selectFields,
    clearFieldsSpace,
    checkAuth,
  };
};
