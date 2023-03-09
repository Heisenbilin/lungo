import { cloneDeep } from '@vben/utils'

const defaultColumns = [
  {
    title: '序号',
    align: 'center',
    width: '5%',
    key: 'serial',
  },
  {
    title: '请求 URL',
    dataIndex: 'resource_url',
    width: '60%',
    key: 'resource_url',
    // slots: { customRender: "api" },
  },
  {
    title: '请求数量',
    dataIndex: 'count',
    key: 'count',
    align: 'center',
    // slots: { customRender: "count" },
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
    // slots: { customRender: "operation" },
  },
]

export const getDefaultColumns = (type, isFail = true) => {
  const columns = cloneDeep(defaultColumns)
  if (!isFail) {
    columns.splice(3, 1)
  }
  if (type === 'interface') {
    return columns
  }
  if (type === 'domain') {
    columns[1].title = '页面 URL'
    columns[1].dataIndex = 'current_href'
    return columns
  }
  return columns
}
