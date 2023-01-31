import { LAYOUT } from '@/router/routes'

const Monitor: RouteRecordItem = {
  path: '/monitor',
  name: 'Monitor',
  component: LAYOUT,
  redirect: '/monitor/list',
  meta: {
    orderNo: 2,
    icon: 'ion:grid-outline',
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
        // ignoreKeepAlive:true,
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
        // ignoreKeepAlive:true,
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
        // ignoreKeepAlive:true,
      },
    },
    // {
    //   path: "workbench",
    //   name: "Workbench",
    //   component: () => import("@/pages/dashboard/workbench/index.vue"),
    //   meta: {
    //     title: "routes.dashboard.workbench",
    //     icon: "ion:grid-outline",
    //   },
    // },
  ],
}

export default Monitor
