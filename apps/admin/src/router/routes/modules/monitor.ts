import { LAYOUT } from '../basic'

const Monitor: RouteRecordItem = {
  path: '/monitor',
  name: 'Monitor',
  component: LAYOUT,
  redirect: '/monitor/list',
  meta: {
    orderNo: 1,
    icon: 'mdi:monitor-dashboard',
    title: 'Web端质量监控',
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
    {
      path: 'logs',
      name: 'logs',
      component: () => import('@/pages/logs/log.vue'),
      meta: {
        title: 'routes.monitor.logs',
        icon: 'ion:grid-outline',
        affix: false,
      },
    },
    {
      path: 'groups',
      name: 'groups',
      component: () => import('@/pages/groups/groups.vue'),
      meta: {
        title: '用户组管理',
        icon: 'ion:grid-outline',
        affix: false,
      },
    },
  ],
}

export default Monitor
