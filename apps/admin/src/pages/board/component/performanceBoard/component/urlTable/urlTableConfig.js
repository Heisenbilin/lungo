import { cloneDeep } from 'lodash-es';
import { commafy } from '/@/utils/math/formatMumber';

const defaultColumns = [
  {
    title: '序号',
    align: 'center',
    width: '5%',
    key: 'serial',
  },
  {
    title: '页面URL',
    dataIndex: 'current_href',
    key: 'current_href',
    width: '40%',
    slots: { customRender: 'url' },
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
    dataIndex: 'pageload',
    key: 'pageload',
    align: 'center',
    customRender: item => commafy(item.text) + ' ms',
  },
  {
    title: '操作',
    align: 'center',
    width: '15%',
    key: 'operation',
    slots: { customRender: 'operation' },
  },
];

export const getDefaultColumns = () => {
  return cloneDeep(defaultColumns);
};
