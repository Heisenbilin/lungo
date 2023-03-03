import { cloneDeep } from '@vben/utils'

const defaultColumns = [
  {
    title: '序号',
    align: 'center',
    width: '5%',
    key: 'serial',
  },
  {
    title: '异常类型',
    dataIndex: 'error_content',
    key: 'error_content',
    width: '70%',
    // slots: { customRender: "error_content" },
  },
  // {
  //   title: '页面URL',
  //   dataIndex: 'current_href',
  //   key: 'current_href',
  //   rowKey: 'current_href',
  //   width: '25%',
  //   slots: { customRender: 'url' },
  // },
  // {
  //   title: '错误文件URL',
  //   dataIndex: 'error_url',
  //   rowKey: 'error_url',
  //   key: 'error_url',
  //   width: '35%',
  //   slots: { customRender: 'file' },
  // },
  {
    title: '异常次数',
    dataIndex: 'count',
    key: 'count',
    align: 'center',
    // slots: { customRender: "count" },
  },
  {
    title: '操作',
    align: 'center',
    width: '15%',
    key: 'operation',
    // slots: { customRender: "operation" },
  },
]

export const getDefaultColumns = type => {
  const columns = cloneDeep(defaultColumns)
  if (type === 'domain')
    columns[1] = {
      title: '页面URL',
      dataIndex: 'err_current_href',
      key: 'url',
      width: '70%',
      // slots: { customRender: "url" },
    }
  return columns
}
