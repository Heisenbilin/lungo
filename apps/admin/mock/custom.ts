import { MockMethod } from 'vite-plugin-mock'
import { requestParams, resultError, xesSuccess } from '@vben/utils/mock-util'

const customList = [
  {
    custom_id: 213120,
    custom_name: '自定义看板1',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213121,
    custom_name: '自定义看板2',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213122,
    custom_name: '自定义看板3',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213123,
    custom_name: '自定义看板4',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213120,
    custom_name: '自定义看板1',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213121,
    custom_name: '自定义看板2',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213122,
    custom_name: '自定义看板3',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213123,
    custom_name: '自定义看板4',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213120,
    custom_name: '自定义看板1',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213121,
    custom_name: '自定义看板2',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213122,
    custom_name: '自定义看板3',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213123,
    custom_name: '自定义看板4',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213120,
    custom_name: '自定义看板1',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213121,
    custom_name: '自定义看板2',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213122,
    custom_name: '自定义看板3',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213123,
    custom_name: '自定义看板4',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213120,
    custom_name: '自定义看板1',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213121,
    custom_name: '自定义看板2',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213122,
    custom_name: '自定义看板3',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
  {
    custom_id: 213123,
    custom_name: '自定义看板4',
    custom_desc: '课堂看板',
    uc_group_id: 2412,
    add_user: 'xiongbilin',
    creat_time: '2023-06-08 15:21:49',
  },
]

export default [
  // mock custom board list
  {
    url: '/v2/custom/list',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const { page = 1, limit = 20 } = request.query

      if (!customList) {
        return resultError('Incorrect account or password！')
      }

      return xesSuccess({
        list: customList.slice((page - 1) * limit, limit * page),
        total: customList.length,
      })
    },
  },
  // mock custom board content
  {
    // url: '/v2/custom/{{custom_id}}',
    url: '/v2/custom/213122',
    timeout: 200,
    method: 'get',
    response: () => {
      return xesSuccess({
        custom_config: {
          version: 1, //json版本
          board_name: '学习报告PV', //看板名称
          board_content: 'pv-pv', //看板内容
          project_id: 10042, //项目id
          width: '1/3', //宽度
          heigth: '400px', //高度
        },
      })
    },
  },
] as MockMethod[]
