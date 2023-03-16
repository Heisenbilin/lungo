import { LAYOUT } from '@vben/router'

const Group: RouteRecordItem = {
  path: '/group',
  name: 'Group',
  component: LAYOUT,
  redirect: '/group/groups',
  meta: {
    orderNo: 3,
    icon: 'ic:sharp-supervised-user-circle',
    title: '用户组管理',
  },
  children: [
    {
      path: 'groups',
      name: 'groups',
      component: () => import('@/pages/groups/groups.vue'),
      meta: {
        title: '用户组管理',
        icon: 'ic:twotone-supervised-user-circle',
        // affix: false,
      },
    },
  ],
}

export default Group
