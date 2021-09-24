import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  // 不指定mode默认为hash模式
  linkExactActiveClass: 'active',
  routes: [{
    path: '/',
    component: () => import('@/layout/publicOrPrivate'),
    children: [
      // {
      //   path: 'userCenter',
      //   name: 'userCenter',
      //   component: () => import('@/views/userCenter'),
      //   meta: {
      //     keepAlive: true
      //   }
      // },
      { // 将空路由放在最后
        path: '', // 默认路由
        name: 'home', // 二级目录不用加 '/'
        component: () => import('@/views/home'),
        meta: {
          keepAlive: true
        }
      },
      { // 将空路由放在最后
        path: '/private', // 默认路由
        name: 'private', // 二级目录不用加 '/'
        component: () => import('@/views/private'),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  // {
  //   path: '/',
  //   component: () => import('@/views/home/loading')
  // },
  {
    path: '/ctrip',
    name: 'ctrip',
    component: () => import('@/views/ctrip/index')
  },
  {
    path: '/hxCtrip/:serviceCode',
    name: 'ctrip',
    component: () => import('@/views/ctrip/hxIndex')
  },
  {
    path: '/planeNote',
    name: 'planeNote',
    component: () => import('@/views/planeNote/index')
  },
  {
    path: '/planeNoteDetail',
    name: 'planeNoteDetail',
    component: () => import('@/views/planeNote/detail')
  },
  {
    path: '/planeNoteDetailDownloadConfirmation',
    name: 'planeNoteDetailDownloadConfirmation',
    component: () => import('@/views/planeNote/downloadConfirmation')
  },
  {
    path: '/planeNoteOrderDetail',
    name: 'planeNoteOrderDetail',
    component: () => import('@/views/planeNote/orderDetail')
  },
  {
    path: '/CostCenter',
    name: 'CostCenter',
    component: () => import('@/views/costCenter')
  },
  {
    path: '/checkEmails',
    name: 'checkEmails',
    component: () => import('@/views/planeNote/checkEmails')
  },
  {
    path: '/checkDepartment',
    name: 'checkDepartment',
    component: () => import('@/views/planeNote/checkDepartment')
  },
  {
    path: '/checkDepartmentUser',
    name: 'checkDepartmentUser',
    component: () => import('@/views/planeNote/checkDepartmentUser')
  },
  {
    path: '/iframe',
    name: 'iframe',
    component: () => import('@/layout/iframeLayout')
  },
  {
    path: '/service',
    name: 'service',
    component: () => import('@/views/service/index')
  },
  {
    path: '/serviceInfo',
    name: 'serviceInfo',
    component: () => import('@/views/service/info')
  },
  {
    path: '/planeSearchForm',
    name: 'planeSearchForm',
    component: () => import('@/views/planeNote/planeSearchForm')
  },
  {
    path: '/errorPage',
    name: 'errorPage',
    component: () => import('@/views/error')
  },
  {
    path: '*', component: () => import('@c/NotFoundPage')
  }],
  // 传送门
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  // ...
  next()
})

export default router
