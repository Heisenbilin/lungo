import { cloneDeep } from '@vben/utils'

const defaultColumns: any = [
  {
    title: '序号',
    align: 'center',
    width: '5%',
    key: 'serial',
  },
  {
    key: 'url',
    width: '60%',
  },
  {
    key: 'count',
    title: '异常次数',
    align: 'center',
    dataIndex: 'count',
    width: '10%',
  },
  {
    key: 'user',
    title: '影响用户量',
    align: 'center',
    dataIndex: 'userCount',
    width: '10%',
  },
  {
    title: '操作',
    align: 'center',
    width: '16%',
    key: 'operation',
  },
]

export const getDefaultColumns = type => {
  const columns = cloneDeep(defaultColumns)
  if (type === 'href') {
    columns[1].title = '异常资源'
    columns[1].dataIndex = 'url'
  } else if (type === 'domain') {
    columns[1].title = '页面URL'
    columns[1].dataIndex = 'current_href'
  } else {
    columns[1].title = '容错成功资源'
    columns[1].dataIndex = 'successsource'
  }
  return columns
}
