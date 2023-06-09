import {
  getBrowserData,
  getClientData,
  getDeviceData,
  getNetworkData,
  getOSData,
  getPageViewData,
  getRegionData,
  getResolutionData,
  getSummaryData,
  getUrlListData,
} from '@/apis/board/pv'

import { getPVUVChartOption, getDefaultColumns, getUAOption } from '@/logics/chartOption/pageview'

import {
  getNetworkTypeOption,
  getClientTypeOption,
  getDeviceTypeOption,
  getResolutionOption,
} from '@/logics/chartOption/pie'

import { getUAMapOption } from '@/logics/chartOption/map'

type ChartItem = {
  key: string
  name: string
  type: 'number' | 'line' | 'bar' | 'pie' | 'table' | 'map'
  width: 'w-full' | 'w-1/3' | 'w-2/3'
  requestData: (params: any) => Promise<any>
  getChartOption: (data: any, timeFormatStr: string) => any
}

type ChartConfig = {
  key: string
  name: string
  charts: ChartItem[]
}

export const chartConfigs: ChartConfig[] = [
  {
    key: 'pageView',
    name: '页面访问',
    charts: [
      {
        key: 'summary',
        name: '',
        type: 'number',
        width: 'w-full',
        requestData: getSummaryData,
        getChartOption: getPVUVChartOption,
      },
      {
        key: 'pv',
        name: 'PV',
        type: 'line',
        width: 'w-1/3',
        requestData: getPageViewData,
        getChartOption: getPVUVChartOption,
      },
      {
        key: 'uv',
        name: 'UV',
        type: 'line',
        width: 'w-1/3',
        requestData: getPageViewData,
        getChartOption: getPVUVChartOption,
      },
      {
        key: 'urlTable',
        name: '页面访问统计',
        type: 'table',
        width: 'w-full',
        requestData: getUrlListData,
        getChartOption: getDefaultColumns,
      },
      {
        key: 'browser',
        name: '浏览器类型',
        type: 'pie',
        width: 'w-1/3',
        requestData: getBrowserData,
        getChartOption: getUAOption,
      },
      {
        key: 'os',
        name: '操作系统类型',
        type: 'pie',
        width: 'w-1/3',
        requestData: getOSData,
        getChartOption: getUAOption,
      },
      {
        key: 'urlMap',
        name: '地域分布',
        type: 'map',
        width: 'w-2/3',
        requestData: getRegionData,
        getChartOption: getUAMapOption,
      },
      {
        key: 'network',
        name: '网络类型',
        type: 'pie',
        width: 'w-1/3',
        requestData: getNetworkData,
        getChartOption: getNetworkTypeOption,
      },
      {
        key: 'client',
        name: '客户端类型',
        type: 'pie',
        width: 'w-1/3',
        requestData: getClientData,
        getChartOption: getClientTypeOption,
      },
      {
        key: 'device',
        name: '设备类型',
        type: 'pie',
        width: 'w-1/3',
        requestData: getDeviceData,
        getChartOption: getDeviceTypeOption,
      },
      {
        key: 'resolution',
        name: '分辨率类型',
        type: 'pie',
        width: 'w-1/3',
        requestData: getResolutionData,
        getChartOption: getResolutionOption,
      },
    ],
  },
]
