import { cloneDeep } from '@vben/utils'

const defaultColumns: any = [
  {
    title: '序号',
    align: 'center',
    width: '5%',
    key: 'serial',
  },
  {
    key: 'content',
    width: '70%',
  },
  {
    key: 'count',
    title: '异常次数',
    align: 'center',
    dataIndex: 'count',
    width: '10%',
    // slots: { customRender: "count" },
  },
  {
    title: '操作',
    align: 'center',
    width: '16%',
    key: 'operation',
    // slots: { customRender: "operation" },
  },
]

export const getDefaultColumns = type => {
  const columns = cloneDeep(defaultColumns)
  if (type === 'href') {
    columns[1].title = '异常资源'
    columns[1].dataIndex = 'resource_url'
  } else if (type === 'domain') {
    columns[1].title = '页面URL'
    columns[1].dataIndex = 'resource_currenthref'
    columns[1].key = 'url'
    // columns[1].slots = { customRender: "url" };
  } else {
    columns[1].title = '容错成功资源'
    columns[1].dataIndex = 'successsource'
  }
  return columns
}
