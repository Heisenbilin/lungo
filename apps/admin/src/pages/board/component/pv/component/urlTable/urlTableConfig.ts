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
  },
  {
    title: 'PV',
    dataIndex: 'pv',
    key: 'pv',
    align: 'center',
    customRender: item => commafy(item.text),
  },
  {
    title: 'UV',
    dataIndex: 'uv',
    key: 'uv',
    align: 'center',
    customRender: item => commafy(item.text),
  },
  {
    title: '操作',
    align: 'center',
    width: '15%',
    key: 'operation',
  },
]

export const getDefaultColumns = () => {
  return cloneDeep(defaultColumns)
}
