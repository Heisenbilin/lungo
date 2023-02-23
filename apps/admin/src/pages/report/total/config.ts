// import { commafy } from '/@/utils/math/formatMumber';

import { commafy } from '@vben/utils'

export const chartsConfig = {
  pv: {
    type: 'pvuv',
    info: '',
    option: {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['上周PV', '本周PV'],
      },
      toolbox: {
        show: true,
        feature: {
          magicType: { type: ['line', 'bar'] },
          restore: {},
        },
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '上周PV',
          type: 'line',
          data: [],
        },
        {
          name: '本周PV',
          type: 'line',
          data: [],
        },
      ],
    },
  },

  uv: {
    type: 'pvuv',
    info: '',
    option: {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['上周UV', '本周UV'],
      },
      toolbox: {
        show: true,
        feature: {
          magicType: { type: ['line', 'bar'] },
          restore: {},
        },
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '上周UV',
          type: 'line',
          data: [],
        },
        {
          name: '本周UV',
          type: 'line',
          data: [],
        },
      ],
    },
  },

  version: {
    type: 'ua-version',
    info: '',
    option: {
      tooltip: {
        trigger: 'item',
        formatter:
          item => `<div style='text-align:left'><div style='display:block;word-break:break-all;white-space:pre-wrap;'>版本：${
            item.data.name
          }</div>
                                        数量：${commafy(item.data.value)}</div>`,
      },
      legend: {
        type: 'scroll',
        data: [],
        orient: 'vertical',
        left: 'right',
        top: '30',
      },
      grid: {
        left: '3%',
        right: '120',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: [],
        inverse: true,
      },
      series: [],
    },
  },

  ua: {
    type: 'ua',
    info: '',
    option: {
      title: {
        subtext: '点击饼图查看或收起版本详情',
        subtextStyle: {
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: item =>
          `<div style='display:block;word-break:break-all;white-space:pre-wrap;'>UA：${
            item.data.name
          }</div>数量：${commafy(item.data.value)}`,
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        left: 'right',
        formatter: function (name) {
          return name.length > 10 ? name.substr(0, 30) + '...' : name
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['40%', '50%'],
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: true,
            formatter: '{d}%',
          },
          legendHoverLink: false,
        },
      ],
    },
  },

  performance_count: {
    type: 'count',
    info: '',
    option: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['上周', '本周'],
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: ['dns', 'tcp', 'ttfb', 'fp', 'tti', 'onload'],
      },
      series: [
        {
          name: '上周',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
          },
        },
        {
          name: '本周',
          type: 'bar',
          data: [],
          label: {
            show: true,
            position: 'right',
          },
        },
      ],
    },
  },
}

interface DefaultColumns {
  title: string
  align?: string
  width?: string
  key: string
  dataIndex?: string
  slots?: object
  sorter?: boolean
  customRender?: Function | string
}

export const defaultColumns: DefaultColumns[] = [
  {
    title: '序号',
    align: 'center',
    width: '5%',
    key: 'serial',
  },
  {
    title: 'URL',
    dataIndex: 'board_url',
    width: '30%',
    key: 'url',
  },
  { title: 'PV', dataIndex: 'pv', key: 'pv', align: 'center', sorter: true },
  {
    title: '性能评分',
    dataIndex: 'performance_score',
    key: 'performance_score',
    align: 'center',
    sorter: true,
  },
  {
    title: '稳定性评分',
    dataIndex: 'stability_score',
    key: 'stability_score',
    align: 'center',
    sorter: true,
  },
  { title: '总体评分', dataIndex: 'avg_score', key: 'avg_score', align: 'center', sorter: true },
  {
    title: '操作',
    align: 'center',
    key: 'operation',
    width: '9%',
  },
]
