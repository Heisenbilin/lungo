const Home: RouteRecordItem = {
  path: '/home',
  name: 'Home',
  component: () => import('@/pages/sys/home/home.vue'),
  meta: {
    orderNo: 4,
    hideMenu: true,
    title: 'Sway Det首页',
  },
}

export default Home
