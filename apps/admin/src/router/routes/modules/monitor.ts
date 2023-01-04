import { LAYOUT } from "../basic";

const dashboard: RouteRecordItem = {
  path: "/monitor",
  name: "Monitor",
  component: LAYOUT,
  redirect: "/monitor/list",
  meta: {
    orderNo: 2,
    icon: "ion:grid-outline",
    title: "Web端质量监控",
  },
  children: [
    {
      path: "list",
      name: "List",
      component: () => import("@/pages/projectList/list.vue"),
      meta: {
        title: "routes.dashboard.analysis",
        icon: "ion:grid-outline",
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
};

export default dashboard;
