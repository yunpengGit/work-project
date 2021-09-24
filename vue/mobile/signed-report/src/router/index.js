import Vue from 'vue'
import VueRouter from 'vue-router'
import HandleRoute from './../router/handleInfo'
import signedReport from './../router/signedReport'
import subsidiaryCompanyRoute from './../router/subsidiaryCompany'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/index.vue')
  // },
  // {
  //   path: '/about',
  //   name: 'about',9
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  ...HandleRoute,
  ...signedReport,
  ...subsidiaryCompanyRoute
]

const router = new VueRouter({
  // mode: 'history',
  // 不指定mode默认为hash模式
  linkExactActiveClass: 'active',
  routes
})

export default router
