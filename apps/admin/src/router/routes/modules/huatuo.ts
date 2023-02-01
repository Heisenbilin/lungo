import { HUATUO_LAYOUT } from '../basic'

const Huatuo: RouteRecordItem = {
  path: '/huatuo',
  name: 'Huatuo',
  component: HUATUO_LAYOUT,
  redirect: '/huatuo/index',
  meta: {
    orderNo: 5,
    icon: 'ion:grid-outline',
    title: '华佗页',
  },
  children: [
    {
      path: 'index',
      name: 'HuatuoList',
      component: () => import('@/pages/list/huatuoList.vue'),
      meta: {
        title: 'routes.huatuo.list',
        icon: 'ion:grid-outline',
      },
    },
    {
      path: 'board',
      name: 'HuatuoBoard',
      component: () => import('@/pages/board/huatuoBoard.vue'),
      meta: {
        title: 'routes.huatuo.board',
        icon: 'ion:grid-outline',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
    {
      path: 'report',
      name: 'HuatuoReport',
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
      name: 'HuatuoqcReport',
      component: () => import('@/pages/report/reportDetail.vue'),
      meta: {
        title: 'routes.huatuo.urlReport',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
    {
      path: 'panel',
      name: 'HuatuoPanel',
      component: () => import('@/pages/panel/huatuoPanel.vue'),
      meta: {
        title: 'routes.huatuo.panel',
        hideBreadcrumb: true,
        icon: 'ion:grid-outline',
        hideMenu: true,
      },
    },
  ],
}

export default Huatuo
