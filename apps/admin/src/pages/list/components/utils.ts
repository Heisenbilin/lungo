import { buildUUID, changeFormFormat, handleDate, cloneDeep } from '@vben/utils'
import { graphic } from '@vben/hooks'
const linearGradient = graphic.LinearGradient

export const adminUsers = [
  'liguojing',
  'gengxiaofei',
  'tianfeng1',
  'liming20',
  'chenjian11',
  'wangliuqi',
  'xiongbilin',
  'jiangnan21',
  'botao',
  'hehongyan3',
]

const paramsObj = {
  1: '参数有效',
  2: '参数无效',
  3: '检测异常',
}

export const scoreData = [
  {
    key: '1',
    name: '运行时异常率',
    low: '>3%',
    middle: '1%~3%',
    high: '<1%',
  },
  {
    key: '2',
    name: '资源异常率',
    low: '>3%',
    middle: '1%~3%',
    high: '<1%',
  },
  {
    key: '3',
    name: '请求成功率',
    low: '<97%',
    middle: ' 97~99%',
    high: '99~100%',
  },
  {
    key: '4',
    name: '页面加载',
    low: '>4S',
    middle: '2.5S~4S',
    high: '<2.5S',
  },
]

export const scoreColumns = [
  {
    title: '评分项',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '0~50分',
    dataIndex: 'low',
    key: 'low',
    align: 'center',
  },
  {
    title: '50～75分',
    dataIndex: 'middle',
    key: 'middle',
    align: 'center',
  },
  {
    title: '75~100分',
    dataIndex: 'high',
    key: 'high',
    align: 'center',
  },
]

export const projectListColumns = [
  {
    title: '应用名称',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: '20%',
  },
  {
    title: 'SDK',
    dataIndex: 'sdk',
    key: 'sdk',
    width: '40px',
  },
  {
    title: '实时评分',
    dataIndex: 'score',
    key: 'score',
    width: '55px',
    align: 'center',
  },
  {
    title: 'PV量',
    dataIndex: 'pv',
    key: 'pv',
    width: '50px',
    align: 'center',
  },
  {
    title: 'UV量',
    key: 'uv',
    dataIndex: 'uv',
    width: '50px',
    align: 'center',
  },
  {
    title: '活跃趋势',
    key: 'chartOption',
    dataIndex: 'chartOption',
    width: '100px',
    align: 'center',
  },
  {
    title: '页面加载',
    key: 'pageloadData',
    dataIndex: 'pageloadData',
    width: '60px',
    align: 'center',
  },
  {
    title: '运行时异常',
    key: 'runtimeError',
    dataIndex: 'runtimeError',
    width: '65px',
    align: 'center',
  },
  {
    title: '资源异常',
    key: 'resourceError',
    dataIndex: 'error',
    width: '55px',
    align: 'center',
  },
  {
    title: '请求成功率',
    key: 'success',
    dataIndex: 'success',
    width: '65px',
    align: 'center',
  },
  {
    title: '看板',
    key: 'screen',
    dataIndex: 'screen',
    width: '160px',
    fixed: 'right',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    fixed: 'right',
    width: '50px',
    align: 'center',
  },
]

//设置分数的颜色样式
export const barFinColor = num => {
  if (num < 50) {
    return 'text-[#ec5c4c]'
  }
  if (49 < num && num < 75) {
    return 'text-[#F2AE57]'
  }
  if (74 < num) {
    return 'text-[#5eca75]'
  }
}

//ua解析
export function handleUaParse(ua_name, ua_flag) {
  //根据keywords解析ua名
  const keywords = ua_flag
    .replace(/\n/gi, ',')
    .replace(/\s/gi, '')
    .replace(/，/gi, ',')
    .split(',')
    .join('|')
  let pattern = `(${keywords})w*[\\/:]?[\\d.]*`
  let regex = new RegExp(pattern, 'ig')
  let res = regex.exec(ua_name)
  if (!res) return {}
  else {
    let [app_name, app_version] = res[0].replace(/:/gi, '/').split('/')
    return { app_name, app_version }
  }
  //上面返回解析到的第一个ua，若想返回多条可以修改注释，执行循环
  // while (res && res[0]) {
  //   if(!regex.global) {
  //     break;
  //   }
  //   let [app_name,app_version] = res[0].replace(/:/ig, '/').split('/')
  //   return app_name,app_version
  //   res = regex.exec(ua_name)
  // }
}

//把表单数据处理成接口请求参数
export function handleProjectParams(form, isShutDown) {
  //是否关闭项目
  const close_project = isShutDown === true ? 1 : 0
  // 登录参数
  let loginParams: any = {
    need_login: 2,
  }
  if (form.auth_info.need_login === 1) {
    // 1、需要登录 2、不需要登录
    loginParams = {
      need_login: 1,
      effective_time: form.auth_info.effective_time,
      notice_users: form.auth_info.notice_users,
      need_notify: form.auth_info.need_notify,
      last_check_time: form.auth_info.authForm.last_check_time,
      last_check_status: form.auth_info.authForm.last_check_status,
      auth_msg: changeFormFormat(form.auth_info.authForm.fields),
      project_url: form.auth_info.project_url,
    }
  }

  //基础信息
  let params: any = {
    name: form.basic_info.project_name,
    saas: form.basic_info.saas,
    belong_project: form.basic_info.belong_project,
    eventid: form.basic_info.eventid,
    appid: form.basic_info.appid,
    gateway: form.basic_info.gateway,
    domain: form.basic_info.domain,
    log_version: 1, //ES中日志解析版本默认为1（新版本）
    log_handle: 1, //ES中日志解析默认1（开启日志解析）
    platforms: 'huatuo.xesv5.com,fedata.xesv5.com', //生效平台默认华佗、Swat Det
    href: form.basic_info.href,
    uc_group_id: form.basic_info.uc_group_id,
    git: form.basic_info.git,
    project_desc: form.basic_info.project_desc,
    weekly_report_receivers: form.basic_info.weekly_report_receivers,
  }
  //若项目开启了sourcemap解析
  if (form.sourcemap_info.sourcemap_analysis === 1) {
    params.sourcemap_analysis = 1
    //使用私有存储
    if (
      form.sourcemap_info.default_storage === 1 &&
      (form.sourcemap_info.access_key_id ||
        form.sourcemap_info.access_key_secret ||
        form.sourcemap_info.bucket)
    ) {
      params.access_key_id = form.sourcemap_info.access_key_id
      params.access_key_secret = form.sourcemap_info.access_key_secret
      params.bucket = form.sourcemap_info.bucket
    } else {
      params.access_key_id = ''
      params.access_key_secret = ''
      params.bucket = ''
    }
    params.enable_log = form.sourcemap_info.enable_log
    //自定义map文件位置
    if (
      form.sourcemap_info.default_upload === 1 &&
      (form.sourcemap_info.upload_from || form.sourcemap_info.upload_to)
    ) {
      params.upload_from = form.sourcemap_info.upload_from
      params.upload_to = form.sourcemap_info.upload_to
    } else {
      params.upload_from = ''
      params.upload_to = ''
    }
    //知音楼消息提醒
    if (form.sourcemap_info.notice_status === 1 && form.sourcemap_info.notice_values.length) {
      let names: any[] = []
      let ids: any[] = []
      form.sourcemap_info.notice_values.forEach(element => {
        const values = element.split('(')
        names.push(values[0])
        ids.push(values[1].slice(0, -1))
      })
      params.notice_status = 1
      params.notice_ids = ids.join('|')
      params.notice_names = names.join(',')
    } else {
      params.notice_status = 0
      params.notice_ids = ''
      params.notice_names = ''
    }
  } else {
    params.sourcemap_analysis = 0
  }
  //若项目开启了自定义UA解析
  if (form.ua_info.length) {
    params.project_ua = form.ua_info.map(item => item.ua_name).join(',')
    params.ua_flag = form.ua_info.map(item => item.ua_flag).join(',')
  }
  return { close_project, ...params, loginParams }
}

//将接口数据初始化成表单数据
export function initEditFormData(resultData) {
  const ua_flag = resultData.ua_flag
  const project_uas = resultData.project_ua.split(',')
  const formData: any = {
    //基本信息
    basic_info: {
      project_name: resultData.project_name,
      saas: resultData.saas === 'yes' || resultData.saas === 'no' ? resultData.saas : undefined,
      eventid: resultData.eventid,
      appid: resultData.appid,
      gateway: resultData.gateway,
      domain: resultData.domain,
      uc_group_id: resultData.uc_group_id,
      href: resultData.href === '-1' ? '' : resultData.href,
      git: resultData.git,
      belong_project: resultData.belong_project,
      project_desc: resultData.project_desc,
      weekly_report_receivers: resultData.weekly_report_receivers,
    },
    //sourcemap配置
    sourcemap_info: {
      sourcemap_analysis: resultData.sourcemap_analysis,
      default_storage:
        resultData.access_key_id || resultData.access_key_id || resultData.bucket ? 1 : 0,
      access_key_id: resultData.access_key_id,
      access_key_secret: resultData.access_key_secret,
      bucket: resultData.bucket,
      enable_log: resultData.enable_log,
      default_upload: resultData.upload_from || resultData.upload_to ? 1 : 0,
      upload_from: resultData.upload_from,
      upload_to: resultData.upload_to,
      notice_status: resultData.notice_status,
      notice_values: resultData.notice_ids
        ? resultData.notice_ids
            .split('|')
            .map((id, index) => `${resultData.notice_names.split(',')[index]}(${id})`)
        : [],
    },
    //ua解析配置
    ua_info: ua_flag.split(',').map((item, i) => {
      const flag = project_uas[i].length && item.length
      return {
        ua_name: project_uas[i],
        ua_flag: item,
        parse_status: flag ? 1 : 0,
        app_name: flag ? handleUaParse(project_uas[i], item).app_name : '',
        app_version: flag ? handleUaParse(project_uas[i], item).app_version : '',
      }
    }),
    auth_info: {
      need_login: +resultData.need_login,
      need_notify: +resultData.need_notify,
      notice_users: resultData.notice_users,
      effective_time: +resultData.effective_time,
      project_url: resultData.project_url,
      authForm: {
        last_check_status: resultData.last_check_status,
        last_check_time: resultData.last_check_time,
        last_check_time_txt: resultData.last_check_time
          ? handleDate({ time: resultData.last_check_time, type: 'YY-MM-DD HH-mm-ss' })
          : '',
        last_check_statusTxt: '',
      },
    },
    auth_info_original_auth_msg: resultData.auth_msg,
  }
  if (resultData.auth_msg) {
    const auth_msg = JSON.parse(resultData.auth_msg)
    let arr: any[] = []
    for (let key in auth_msg) {
      auth_msg[key].forEach(element => {
        arr.push({ index: buildUUID(), field: `${key}`, ...element })
      })
    }
    formData.auth_info.authForm.fields = arr
  }
  formData.auth_info.authForm.last_check_statusTxt = resultData.last_check_status
    ? paramsObj[+resultData.last_check_status]
    : ''
  if (!resultData.last_check_status) {
    formData.auth_info.authForm.last_check_time_txt = ''
  }
  return formData
}

export function caculatePageSizeByWidth(w) {
  if (w) {
    if (w < 1280) {
      return 6
    }
    if (w < 1536) {
      return 10
    }
    if (w < 2000) {
      return 12
    }
    // if (w < 2520) {
    //   return 16;
    // }
    return 16
  }
  return 10
}

const defaultOption = {
  grid: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  xAxis: {
    show: false,
    data: ['1', '2'],
  },
  yAxis: {
    show: false,
  },
  series: [
    {
      data: [0, 0],
      type: 'line',
      sampling: 'lttb',
      symbol: 'none',
      itemStyle: {
        color: '#f77f00',
      },
      areaStyle: {
        color: new linearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#f77f00',
          },
          {
            offset: 1,
            color: '#fff',
          },
        ]),
      },
    },
  ],
}

export const getTendencyChartOption = data => {
  const chartOption: any = cloneDeep(defaultOption)
  if (!(Array.isArray(data) && data.length)) return chartOption
  let timeList = data.length === 1 ? ['1'] : []
  let countList = data.length === 1 ? [0] : []
  data.forEach(item => {
    timeList.push(item.query_time)
    countList.push(item.board_count)
  })
  chartOption.xAxis.data = timeList
  chartOption.series[0].data = countList
  return chartOption
}
