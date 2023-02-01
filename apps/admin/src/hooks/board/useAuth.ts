import { buildUUID, handleDate } from '@vben/utils'
import { changeFormFormat } from '@vben/utils'
import { checkLightHouseAuth } from '@/apis/auth'
import { message, Modal } from 'ant-design-vue'
import { h } from 'vue'
import { getProjectById, getGroupRoleUsers } from '@/apis/bigfish'

const REG_SPACE = /[ ]/g

const addAuthField = authForm => {
  authForm.fields.push({
    index: buildUUID(),
    field: '',
    key: '',
    value: '',
  })
}

const removeAuthField = (authForm, index) => {
  authForm.fields = authForm.fields.filter(item => item.index != index)
}

const selectFields = [
  { value: 'header' },
  { value: 'query' },
  { value: 'cookie' },
  { value: 'localStorage' },
]

const clearFieldsSpace = (authForm, index, type) => {
  authForm.fields[index][type] = (authForm.fields[index][type] + '').replace(REG_SPACE, '')
}

const checkAuth = async (formRef, auth_info, project_url, form) => {
  try {
    const nameList: any[] = []
    auth_info.authForm.fields.forEach((_, index) => {
      nameList.push(
        ['auth_info', 'authForm', 'fields', index, 'field'],
        ['auth_info', 'authForm', 'fields', index, 'key'],
        ['auth_info', 'authForm', 'fields', index, 'value'],
        ['auth_info', 'project_url'],
      )
    })
    await formRef.validateFields(nameList)
    auth_info.checkLoading = true
    const auth_msg = JSON.stringify(changeFormFormat(auth_info.authForm.fields))
    form.auth_info_original_auth_msg = auth_msg
    const { data: res } = await checkLightHouseAuth({ auth_msg, project_url })
    const { data = {} } = res
    // console.log('data', data);
    if (data.status === 0) {
      auth_info.authForm.last_check_status = 1
      auth_info.authForm.last_check_statusTxt = '参数有效'
      auth_info.authForm.last_check_time = new Date()
      auth_info.authForm.last_check_time_txt = handleDate({
        time: auth_info.authForm.last_check_time,
        type: 'YY-MM-DD HH-mm-ss',
      })
      message.success(data.msg)
    } else if (data.status === 1) {
      auth_info.authForm.last_check_status = 2
      auth_info.authForm.last_check_statusTxt = '参数无效'
      auth_info.authForm.last_check_time = new Date()
      auth_info.authForm.last_check_time_txt = handleDate({
        time: auth_info.authForm.last_check_time,
        type: 'YY-MM-DD HH-mm-ss',
      })
      message.error(data.msg)
    } else {
      message.error(data.msg)
    }
  } catch (error) {
    console.log('checkAuth', error)
    if (error) {
      auth_info.authForm.last_check_status = 3
      auth_info.authForm.last_check_statusTxt = '检测异常'
      auth_info.authForm.last_check_time = new Date()
      auth_info.authForm.last_check_time_txt = handleDate({
        time: auth_info.authForm.last_check_time,
        type: 'YY-MM-DD HH-mm-ss',
      })
    }
  }

  auth_info.checkLoading = false
}

export const useAuth = () => {
  return {
    addAuthField,
    removeAuthField,
    selectFields,
    clearFieldsSpace,
    checkAuth,
  }
}

//当id不在项目列表中时，添加项目无权限信息提示
export const useProjectDeny = async pid => {
  // 以下2个语句都可
  // TODO: 改成专门根据projectid获取group成员的接口
  const result = await getProjectById(pid)
  // const result = await BigfishApi.getProjectById (unref(currentRoute).params.projectid);
  const { stat, msg, data } = result
  if (stat !== 1 || msg !== 'success') {
    message.warning('项目权限请求失败')
    return
  }
  if (!data || !Object.keys(data).length) {
    message.error('不存在的项目')
    return
  }
  const { uc_group_id, project_name, appid } = data
  // admin_uc_group_id.value = uc_group_id
  //获取用户组的知音楼信息
  await getGroupRoleUsers(uc_group_id, 0, 10000)
  if (result.stat === 1) {
    const adminUsers =
      result.data?.users.map(item => ({
        user_name: item.user_name,
        href: `yach://yach.zhiyinlou.com/session/sessionp2p?sessionid=${item.yachid}`,
      })) ?? []
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
          adminUsers.map((user, index) =>
            h(
              'a',
              { key: index, href: user.href },
              `${user.user_name}${index !== adminUsers.length - 1 ? '、' : ''}`,
            ),
          ),
        ]),
      ]),
    })
  }
}

export const useProjectClose = project => {
  Modal.warning({
    title: '项目已关闭',
    content: h('div', {}, [
      h('br'),
      h('span', `项目名称：${project.project_name}`),
      h('br'),
      h('br'),
      h('span', '在项目列表中开启项目后方可查看该页面'),
    ]),
  })
}
