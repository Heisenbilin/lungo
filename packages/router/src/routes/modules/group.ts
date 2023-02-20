import { LAYOUT } from '../basic'

const Group: RouteRecordItem = {
  path: '/group',
  name: 'Group',
  component: LAYOUT,
  redirect: '/group/groups',
  meta: {
    orderNo: 3,
    icon: 'mdi:monitor-dashboard',
    title: '用户组管理',
  },
  children: [
    {
      path: 'groups',
      name: 'groups',
      component: () => import('@/pages/groups/groups.vue'),
      meta: {
        title: '用户组管理',
        icon: 'ion:grid-outline',
        // affix: false,
      },
    },
  ],
}

export default Group
