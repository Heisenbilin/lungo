import { HUATUO_LAYOUT } from '../basic'

const dashboard: RouteRecordItem = {
  path: '/huatuo',
  name: 'Huatuo',
  component: HUATUO_LAYOUT,
  redirect: '/huatuo/list',
  meta: {
    orderNo: 5,
    icon: 'ion:grid-outline',
    title: '华佗页',
  },
  children: [
    {
      path: 'list',
      name: 'List',
      component: () => import('@/pages/list/list.vue'),
      meta: {
        title: 'routes.huatuo.list',
        icon: 'ion:grid-outline',
      },
    },
    {
      path: 'board',
      name: 'Board',
      component: () => import('@/pages/board/board.vue'),
      meta: {
        title: 'routes.huatuo.board',
        icon: 'ion:grid-outline',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
    {
      path: 'report',
      name: 'Report',
      component: () => import('@/pages/report/reportInfo.vue'),
      meta: {
        title: 'routes.huatuo.report',
        icon: 'ion:grid-outline',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
    {
      path: 'qcReport',
      name: 'qcReport',
      component: () => import('@/pages/report/reportDetail.vue'),
      meta: {
        title: 'routes.huatuo.urlReport',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
    {
      path: 'panel',
      name: 'Panel',
      component: () => import('@/pages/panel/panel.vue'),
      meta: {
        title: 'routes.huatuo.panel',
        hideBreadcrumb: true,
        icon: 'ion:grid-outline',
        hideMenu: true,
      },
    },
  ],
}

export default dashboard
