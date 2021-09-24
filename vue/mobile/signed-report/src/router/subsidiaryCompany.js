export default [
  // {
  //   path: '/handle',
  //   name: 'handle',
  //   component: handle
  // },
  {
    // path: '/handle',
    path: '/subsidiaryCompany',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../components/CheckboxList.vue')
    component: () => import(/* webpackChunkName: "about" */ '../views/subsidiaryCompany/index.vue')
  },
  {
    path: '/subsidiaryCompany/groupLeaderCirculate',
    component: () => import(/* webpackChunkName: "about" */ '../views/subsidiaryCompany/groupLeaderCirculate.vue')
  },
  {
    path: '/subsidiaryCompany/ownDepartmentCirculate',
    component: () => import(/* webpackChunkName: "about" */ '../views/subsidiaryCompany/ownDepartmentCirculate.vue')
  },
  {
    path: '/subsidiaryCompany/ownDepartmentHandle',
    component: () => import(/* webpackChunkName: "about" */ '../views/subsidiaryCompany/ownDepartmentHandle.vue')
  },
  {
    path: '/subsidiaryCompany/otherDepartmentCirculate',
    component: () => import(/* webpackChunkName: "about" */ '../views/subsidiaryCompany/otherDepartmentCirculate.vue')
  },
  {
    path: '/subsidiaryCompany/otherDepartmentHandle',
    component: () => import(/* webpackChunkName: "about" */ '../views/subsidiaryCompany/otherDepartmentHandle.vue')
  }
]
