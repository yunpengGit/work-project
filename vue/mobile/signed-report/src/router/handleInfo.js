export default [
  // {
  //   path: '/handle',
  //   name: 'handle',
  //   component: handle
  // },
  {
    // path: '/handle',
    path: '/',
    name: 'handle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../components/CheckboxList.vue')
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/index.vue')
  },
  {
    path: '/groupLeaderCirculate',
    name: 'groupLeaderCirculate',
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/groupLeaderCirculate.vue')
  },
  {
    path: '/groupLeaderAssistantCirculate',
    name: 'groupLeaderAssistantCirculate',
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/groupLeaderAssistantCirculate.vue')
  },
  {
    path: '/ownDepartmentCirculate',
    name: 'ownDepartmentCirculate',
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/ownDepartmentCirculate.vue')
  },
  {
    path: '/ownDepartmentHandle',
    name: 'ownDepartmentHandle',
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/ownDepartmentHandle.vue')
  },
  {
    path: '/settleApprover',
    name: 'settleApprover',
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/settleApprover.vue')
  },
  {
    path: '/otherDepartmentCirculate',
    name: 'otherDepartmentCirculate',
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/otherDepartmentCirculate.vue')
  },
  {
    path: '/otherDepartmentHandle',
    name: 'otherDepartmentHandle',
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/otherDepartmentHandle.vue')
  },
  {
    path: '/conclusions',
    name: 'conclusions',
    component: () => import(/* webpackChunkName: "about" */ '../views/handleInfo/conclusions.vue')
  }
]
