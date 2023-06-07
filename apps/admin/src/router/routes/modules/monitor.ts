import { LAYOUT } from '@vben/router'

const Monitor: RouteRecordItem = {
  path: '/monitor',
  name: 'Monitor',
  component: LAYOUT,
  redirect: '/monitor/list',
  meta: {
    orderNo: 1,
    icon: 'mdi:monitor-dashboard',
    title: 'Web前端监控',
  },
  children: [
    {
      path: 'list',
      name: 'List',
      component: () => import('@/pages/list/list.vue'),
      meta: {
        title: 'routes.monitor.list',
        icon: 'ion:grid-outline',
        ignoreKeepAlive: false,
      },
    },
    {
      path: 'board',
      name: 'Board',
      component: () => import('@/pages/board/board.vue'),
      meta: {
        title: 'routes.monitor.board',
        icon: 'ion:grid-outline',
        hideMenu: true,
      },
    },
    {
      path: 'report',
      name: 'Report',
      component: () => import('@/pages/report/reportInfo.vue'),
      meta: {
        title: 'routes.monitor.report',
        icon: 'ion:grid-outline',
        hideMenu: true,
      },
    },
    {
      path: 'custom',
      name: 'Custom',
      component: () => import('@/pages/custom/customBoard.vue'),
      meta: {
        title: 'routes.monitor.custom',
        icon: 'ion:grid-outline',
        hideMenu: true,
      },
    },
    {
      path: 'qcReport',
      name: 'qcReport',
      component: () => import('@/pages/report/reportDetail.vue'),
      meta: {
        title: 'routes.monitor.urlReport',
        hideMenu: true,
      },
    },
    {
      path: 'panel',
      name: 'Panel',
      component: () => import('@/pages/panel/panel.vue'),
      meta: {
        title: 'routes.monitor.panel',
        icon: 'ion:grid-outline',
        hideMenu: true,
      },
    },
  ],
}

export default Monitor
