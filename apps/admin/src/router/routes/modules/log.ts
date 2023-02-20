import { LAYOUT } from '@vben/router'

const Log: RouteRecordItem = {
  path: '/log',
  name: 'Log',
  component: LAYOUT,
  redirect: '/log/logs',
  meta: {
    orderNo: 4,
    icon: 'mdi:monitor-dashboard',
    title: '操作日志',
  },
  children: [
    {
      path: 'logs',
      name: 'logs',
      component: () => import('@/pages/logs/log.vue'),
      meta: {
        title: '操作日志',
        icon: 'ion:grid-outline',
        // affix: false,
      },
    },
  ],
}

export default Log
