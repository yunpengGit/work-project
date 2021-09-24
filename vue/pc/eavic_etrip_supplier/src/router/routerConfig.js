import { Basic, UserLayout, RouteView, LeftAndRightColumns } from './../layouts'

export const localRouterMap = [
  {
    path: '/',
    name: 'index',
    meta: { title: '首页' },
    component: Basic,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        id: '0',
        meta: { title: '系统首页', keepAlive: true, icon: 'home' },
        component: () => import('../views/home.vue')
      },
      {
        path: 'order',
        name: 'order',
        redirect: '/order/success',
        component: LeftAndRightColumns,
        id: 'order',
        meta: { title: '订单', keepAlive: true, icon: 'account-book' },
        children: [
          {
            path: 'orderLayout',
            name: 'orderLayout',
            id: 'order_layout',
            meta: { title: '订单管理', keepAlive: true },
            component: () => import('../views/order/layout.vue'),
            redirect: 'success',
            children: [
              {
                path: 'success',
                name: 'success',
                id: 'order_success',
                meta: { title: '成功订单', keepAlive: true },
                component: () => import('../views/order/success.vue')
              },
              {
                path: 'failure',
                name: 'failure',
                id: 'order_failure',
                meta: { title: '失败订单', keepAlive: true },
                component: () => import('../views/order/failure.vue')
              },
              {
                path: 'fetch',
                name: 'fetch',
                id: 'order_fetch',
                meta: { title: '订单抓取', keepAlive: true },
                component: () => import('../views/order/fetch.vue')
              },
              {
                path: 'pastAbnormal',
                name: 'pastAbnormal',
                id: 'order_pastAbnormal',
                meta: { title: '往期异常订单', keepAlive: true },
                component: () => import('../views/order/pastAbnormal.vue')
              },
              {
                path: 'billManagement',
                name: 'billManagement',
                id: 'order_billManagement',
                meta: { title: '账单管理', keepAlive: true },
                component: () => import('../views/order/billManagement.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/systemManagement',
        name: 'systemManagement',
        id: 'systemManagement',
        redirect: '/dataDictionary/sensitiveWords',
        component: RouteView,
        meta: { title: '系统管理', keepAlive: true, icon: 'home' },
        children: [
          {
            path: 'batchTask',
            name: 'batchTask',
            id: 'systemManagement-batchTask',
            meta: { title: '批量任务', keep: true },
            component: () => import('../views/systemManagement/batchTask.vue')
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
/*
*基本路由
*
*/
export const baseRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '../views/user/login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: () => import('../views/user/recover.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/user/register.vue')
      }
    ]
  }
]
