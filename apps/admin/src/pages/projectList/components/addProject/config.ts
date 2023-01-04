import { buildUUID,isUrl } from "@vben/utils";
const REG_EN_CODE = /^[A-Za-z0-9_-]+$/;

// 检验通知用户
const checkNoticeUsers = (rule, value) => {
  if ((value && value.length === 0) || !value) {
    return Promise.reject("请至少选择一位通知用户");
  }
  return Promise.resolve();
};

// 校验认证字段的字段名称
// const checkAuthField = (rule, value, callback) => {
//   if (!value) {
//     return callback(new Error('请选择字段名称'));
//   }
//   const arr = selectFields.map((item) => item.value);
//   if (!arr.includes(value)) {
//     return callback(new Error('请选择正确的字段名称'));
//   }
//   return callback();
// };

// 校验字段KEY
//, callback
const checkAuthKey = (rule, value) => {
  if (!value) {
    return Promise.reject("请输入KEY值");
  }
  if (!REG_EN_CODE.test(value)) {
    return Promise.reject("仅支持大小写英文字母、阿拉伯数字、_（下划线）-（短横线）");
  }
  if (!(value.length >= 1 && value.length <= 128)) {
    return Promise.reject("KEY值限制最长128字符");
  }
  return Promise.resolve();
};

// 校验字段VAlUE
//, callback
const checkAuthValue = (rule, value) => {
  if (!value) {
    return Promise.reject("请输入VALUE值");
  }
  // if(!REG_VALUE.test(value)) {
  // 	return callback(new Error('不支持除_（下划线）-（短横线）=（等号）.（点符）以外的特殊字符'))
  // }
  // if(!(value.length >= 1 && value.length <= 2048)) {
  // 	return callback(new Error('VALUE值限制最长2048字符'))
  // }
  return Promise.resolve();
};

const checkProjectUrl = (rule, value) => {
  if (!value) {
    return Promise.reject("请输入项目url");
  }
  console.log("zheli");
  if (!isUrl(value)) {
    return Promise.reject("请输入项目url，需包含完整协议和域名");
  }
  return Promise.resolve();
};

export const DEFAULT_FORM = {
  basic_info: {
    log_handle: 1,
    log_version: 1,
    git: "",
    belong_project: "",
    href: "",
    project_desc: "",
    weekly_report_receivers: [],
  },
  sourcemap_info: {
    sourcemap_analysis: 0,
    default_storage: 0,
    enable_log: 0,
    default_upload: 0,
    notice_status: 0,
    notice_values: [],
  },
  ua_info: [
    // {
    //   ua_name:'',
    //   ua_flag:'',
    //   parse_status:0,
    //   app_name:'',
    //   app_version:''
    // }
  ],
  auth_info: {
    checkLoading: false,
    need_login: 2,
    effective_time: null,
    auth_msg: [],
    notice_users: [],
    project_url: "",
    need_notify: 2,
    last_check_time: "",
    last_check_status: "",
    authForm: {
      fields: [
        {
          index: buildUUID(),
          field: "",
          key: "",
          value: "",
        },
      ],
    },
  },
};

export const GATEWAYS = {
  "世纪互联-线上环境-网校-APP网关-公共集群-公共业务": "basiclog-ha-access*",
  "世纪互联-线上环境-美校大班云-APP网关-公共集群-公共业务":
    "basiclog-xk-nfx-online-bigclass-app-common-common*",
  "世纪互联-线上环境-网校-APP网关-课前集群-公共业务": "basiclog-online-xes-app-keqian-access*",
  "世纪互联-线上环境-网校-APP网关-大班集群-公共业务": "basiclog-online-xes-app-study-access*",
  "阿里云-线上环境-网校-独立APP网关-公共集群-公共业务": "basiclog-ali-independent-gw-l7-access*",
  "阿里云-线上环境-网校-独立API网关-公共集群-公共业务": "basiclog-ali-independent-gw-api-access*",
  "阿里云-生产环境-培优业务系统-APP网关-公共集群-公共业务":
    "basiclog-ali-online-speiyoubusiness-app-common-common-access-1*",
  "阿里云-生产环境-培优线下课堂-APP网关-公共集群-公共业务":
    "basiclog-ali-online-speiyouofflineclass-app-access*",
  "阿里云-灰度环境-培优业务系统-APP网关-公共集群-公共业务":
    "basiclog-ali-gray-speiyouxesapp-app-access*",
  "阿里云-生产环境-培优在线课堂-APP网关-运营平台-公共业务":
    "basiclog-ali-online-speiyouonlineclass-app-access*",
  "阿里云-生产环境-培优在线课堂-APP网关-课堂平台-公共业务":
    "basiclog-ali-online-speiyouonlineclass-app-access*",
  "阿里云-生产环境-培优在线课堂-APP网关-消息平台-公共业务":
    "basiclog-ali-online-speiyouonlineclass-app-access*",
  "阿里云-生产环境-培优在线课堂-APP网关-直播平台-公共业务":
    "basiclog-ali-online-speiyouonlineclass-app-access*",
  "M5-生产环境-培优业务系统-APP网关-公共集群-公共业务":
    "basiclog-m5-online-speiyoubusiness-app-common-common-access-1*",
  "阿里云-生产环境-培优学而思APP-APP网关-公共集群-公共业务":
    "basiclog-ali-online-speiyouxesapp-app-common-common-access*",
  "阿里云-正式环境-培优云平台-APP网关-公共部门-公共业务":
    "basiclog-ali-online-speiyoucloud-app-access*",
  "阿里云-生产环境-培优在线课堂-APP网关-静态平台":
    "basiclog-ali-online-speiyouonlineclass-app-access*",
  "阿里云-生产环境-培优学而思APP-APP网关-B端集群-公共业务":
    "basiclog-ali-online-speiyouxesapp-app-b-common-access*",
  "博兴-正式环境-用户中台-APP网关-公共部门-公共业务": "basiclog-bx-online-udc-app-access*",
  "博兴-正式环境-用户中台-API网关-公共部门-公共业务": "basiclog-bx-online-udc-api-access*",
  "阿里云-正式环境-用户中台-APP网关-公共部门-公共业务":
    "basiclog-ali-online-udc-app-common-access*",
  "阿里云-正式环境-用户中台-API网关-公共部门-公共业务":
    "basiclog-ali-online-udc-api-common-access*",
  "世纪互联-生产环境-AI中台-APP网关-公共部门-AI中台": "basiclog-sjhl-online-aizhongtai-app-access*",
  "阿里云-线上环境-网校-独立APP网关-网校1v1-公共业务":
    "basiclog-ali-online-xes-app-idptxes1v1-common-access*",
  "香港-正式环境-网校1v1-APP网关-公共部门-公共业务": "basiclog-xg-online-xes1v1-app-common-access*",
  "亚马逊-正式环境-网校1v1-APP网关-公共部门-公共业务": "basiclog-aws-online-1v1-app-common-access*",
  "阿里云-生产环境-大学生-APP网关-公共集群-公共业务": "basiclog-academician-pro-gw-api-access*",
  "阿里云-生产环境-直播云-APP网关-公共集群-公共业务": "basiclog-ali-online-zhiboyun-app-access*",
  "腾讯云-生产环境-智康-APP网关-公共集群-公共业务": "basiclog-zhikang-gw-ha-access*",
  "腾讯云-生产环境-智康-APP网关-公共集群-支付业务":
    "basiclog-tx-online-izhikang-app-common-pay-access*",
  "阿里云-生产环境-集团总部晓搜题-APP网关-公共集群-公共业务":
    "basiclog-ali-online-jituan-tpp-app-access*",
  "阿里云-生产环境-集团总部晓搜题-API网关-公共集群-公共业务":
    "basiclog-ali-online-jituan-tpp-api-access*",
  "阿里云-线上环境-集团总部学而思口算-APP网关-公共集群-公共业务":
    "basiclog-ali-online-xeskousuan-app-access*",
  "阿里云-线上环境-集团总部学而思口算-API网关-公共集群-公共业务":
    "basiclog-ali-online-xeskousuan-api-access*",
  "阿里云-线上环境-网校-独立网关独立APP网关-小猴独立网关-公共业务":
    "basiclog-ali-online-xes-app-idptxiaohou-common-access*",
  "阿里云-生产环境-内容云-APP网关-公共集群-公共业务": "basiclog-ali-online-jtnry-app-access*",
  "腾讯云-正式环境-Yach-APP网关-公共部门-公共业务":
    "basiclog-sjhl-online-yach-app-common-common-access*",
  "阿里云-线上环境-网校-独立APP网关-励步英语-公共业务":
    "basiclog-ali-online-xes-app-idptlibuyingyu-common-access*",
  "世纪互联-正式环境-爱贝壳-APP网关-公共部门-公共业务":
    "basiclog-bx-online-aibeike-app-common-access*",
  "阿里云-正式环境-轻课-APP网关-公共部门-公共业务":
    "basiclog-ali-online-qingke-app-common-common-access*",
  "马驹桥-正式环境-集团效能-APP网关-公共部门-公共业务":
    "basiclog-mjq-online-efficiency-app-access*",
  "马驹桥-正式环境-安全中台-APP网关-公共部门-公共业务":
    "basiclog-mjq-online-anquanzhongtai-app-access*",
  "阿里云-正式环境-魔法校直播云-APP网关-公共部门-公共业务":
    "basiclog-ali-online-mfxzby-app-common-common-access*",
  "阿里云-线上环境-AI中台-APP网关-公共部门-公共业务":
    "basiclog-ali-online-aizhongtai-app-common-common-access*",
  "世纪互联-线上环境-网校-API网关-公共集群-公共业务": "basiclog-gw-admin*",
  "阿里云-生产环境-培优学而思APP-APP网关-新B端集群-公共业务":
    "basiclog-ali-online-speiyouxesapp-app-new-b-common-access*",
  "阿里云-生产环境-培优学而思APP-APP网关-新vpc集群-公共业务": "*",
  "腾讯云-线上环境-AI中台-APP网关-公共部门-公共业务":
    "basiclog-tx-online-aizhongtai-app-common-common-access*",
};

//表单验证规则
export const VALIDATE_RULES = {
  //git规则 http开头
  //eventid也必须是字符串 不能为汉字
  //appid小于15位的字符串
  basic_info: {
    project_name: [
      { type: "string", required: true, message: "项目名称不能为空", trigger: "blur" },
      { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" },
    ],
    saas: [{ type: "string", required: true, message: "请选择是否为saas项目", trigger: "blur" }],
    eventid: [
      { type: "string", required: true, message: "eventid不能为空", trigger: "blur" },
      { min: 2, max: 250, message: "长度在 2 到 250 个字符", trigger: "blur" },
    ],
    appid: [
      { type: "string", required: true, message: "appid不能为空", trigger: "blur" },
      { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" },
    ],
    // gateway: [{ type: 'string', required: true, message: '请选择所属网关', trigger: 'blur' }],
    // domain: [
    //   { type: 'string', required: true, message: '请选择用于网关筛选的domain', trigger: 'blur' },
    // ],
    uc_group_id: [{ type: "number", required: true, message: "请选择关联用户组", trigger: "blur" }],
    // git: [
    //   { type: 'string', required: true, message: 'git地址不能为空', trigger: 'blur' },
    //   { min: 2, max: 250, message: '长度在 2 到 250 个字符', trigger: 'blur' }
    // ],
    // belong_project: [
    //   { type: 'string', required: true, message: '所属项目不能为空', trigger: 'blur' },
    //   { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
    // ],
  },
  sourcemap_info: {
    access_key_id: [
      {
        type: "string",
        required: true,
        message: "请输入access_key_id或关闭私有存储",
        trigger: "blur",
      },
    ],
    access_key_secret: [
      {
        type: "string",
        required: true,
        message: "请输入access_key_secret或关闭私有存储",
        trigger: "blur",
      },
    ],
    bucket: [
      { type: "string", required: true, message: "请输入bucket或关闭私有存储", trigger: "blur" },
    ],
  },
  ua_info: {
    ua_name: [{ type: "string", required: true, message: "UA字段不能为空", trigger: "blur" }],
    ua_flag: [{ type: "string", required: true, message: "UA解析关键字不能为空", trigger: "blur" }],
  },
  authRules: {
    project_url: [{ required: true, validator: checkProjectUrl, trigger: "blur" }],
    field: [{ required: true, message: "认证字段不能为空", trigger: "change" }],
    key: { validator: checkAuthKey, trigger: "blur" },
    value: { validator: checkAuthValue, trigger: "blur" },
    effective_time: [
      { type: "number", required: true, message: "登录有效期不能为空", trigger: "blur" },
    ],
    notice_users: [{ validator: checkNoticeUsers, trigger: "blur", required: true }],
    need_notify: [
      { type: "number", required: true, message: "请选择是否知音楼提醒", trigger: "change" },
    ],
  },
};
