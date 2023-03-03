import { cloneDeep, commafy } from '@vben/utils'

const defaultColumns = [
  {
    title: '序号',
    align: 'center',
    width: '5%',
    key: 'serial',
  },
  {
    title: '页面URL',
    dataIndex: 'url',
    key: 'url',
    width: '40%',
    // slots: { customRender: "url" },
  },
  {
    title: 'PV',
    dataIndex: 'count',
    key: 'count',
    align: 'center',
    customRender: item => commafy(item.text),
  },
  {
    title: '首字节',
    dataIndex: 'firstbyte',
    key: 'firstbyte',
    align: 'center',
    customRender: item => commafy(item.text) + ' ms',
  },
  {
    title: 'DOM Ready',
    dataIndex: 'dom',
    key: 'dom',
    align: 'center',
    customRender: item => commafy(item.text) + ' ms',
  },
  {
    title: '页面完全加载',
    dataIndex: 'load',
    key: 'load',
    align: 'center',
    customRender: item => commafy(item.text) + ' ms',
  },
  {
    title: '操作',
    align: 'center',
    width: '15%',
    key: 'operation',
    // slots: { customRender: "operation" },
  },
]

export const getDefaultColumns = () => {
  return cloneDeep(defaultColumns)
}