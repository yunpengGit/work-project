/*
 * @Author: pengpeng
 * @Date: 2020-10-13 13:49:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-30 14:32:48
 * @Description: file content
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'tabBar',
    component: () => import(/* webpackChunkName: "tabBar" */ '../layouts/tabBar.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        meta: {
          title: '机票预订'
        },
        component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue')
      },
      {
        path: '/tripRecord',
        name: 'TripRecord',
        meta: {
          title: '行程记录'
        },
        component: () => import(/* webpackChunkName: "tripRecord" */ '../views/tripRecord/index.vue')
      },
      {
        path: '/onlineService',
        name: 'OnlineService',
        meta: {
          title: '在线客服'
        },
        component: () => import(/* webpackChunkName: "tripRecord" */ '../views/tripRecord/index.vue')
      }
    ]
  },
  {
    path: '/tripRecord/detail',
    name: 'tripRecordDetail',
    meta: {
      title: '行程详情'
    },
    component: () => import(/* webpackChunkName: "detailCompany" */ '../views/tripRecord/detail.vue')
  },
  {
    path: '/tripRecord/detail/costCenter',
    name: 'tripRecordDetailCostCenter',
    meta: {
      title: '成本中心'
    },
    component: () => import(/* webpackChunkName: "department" */ '../views/tripRecord/costCenter.vue')
  },
  {
    path: '/tripRecord/detail/orderDetail',
    name: 'tripRecordDetailOrderDetail',
    meta: {
      title: '订单详情'
    },
    component: () => import(/* webpackChunkName: "titckDetail.vue" */ '../views/tripRecord/orderDetail.vue')
  },
  {
    path: '/home/detailCompany',
    name: 'homeDetailCompany',
    meta: {
      title: '公司简介'
    },
    component: () => import(/* webpackChunkName: "detailCompany" */ '../views/home/detailCompany.vue')
  },
  {
    path: '/tripRecord/confirmation',
    name: 'tripRecordConfirmation',
    meta: {
      title: '确认函'
    },
    component: () => import(/* webpackChunkName: "confirmation" */ '../views/tripRecord/confirmation.vue')
  },
  {
    path: '/tripRecord/confirmation/sendEmail',
    name: 'tripRecordConfirmationSendEmail',
    meta: {
      title: '发送到邮箱'
    },
    component: () => import(/* webpackChunkName: "sendEmail" */ '../views/tripRecord/sendEmail.vue')
  },
  {
    path: '/errorPage',
    name: 'errorPage',
    meta: {
      title: '错误了呀'
    },
    component: () => import(/* webpackChunkName: "department" */ '../views/errorPage.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: __dirname,
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  // console.log(to)
  // console.log(from)
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  if (to.meta.title) {
    if (to.path === '/home/detailCompany') {
      document.querySelector('title').innerText = to.query.companyName + '简介'
    } else {
      document.querySelector('title').innerText = to.meta.title
    }
  }
  next()
})

export default router
