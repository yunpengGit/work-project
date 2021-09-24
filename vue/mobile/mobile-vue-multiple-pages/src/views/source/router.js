import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // 不指定mode默认为hash模式
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'page',
    component: () => import(/* webpackChunkName: "openSource" */ './openSource.vue')
  }]
})

router.beforeEach((to, from, next) => {
  // ...
  next()
})

export default router
