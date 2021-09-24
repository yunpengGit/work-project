/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-08-26 14:09:33
 */
import router from './router'
import store from './store'
// import { Message } from '@avic/golden-pc-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

// const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
const token = getToken()

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  NProgress.start()
  if (process.env.NODE_ENV === 'development' && !token && to.path !== '/login') {
    next({ path: '/login' })
    NProgress.done()
  } else {
    // const userInfo = store.getters.userInfo
    if (store.getters.roles.length) {
      next()
    } else {
      if (!token) {
        store.dispatch('Login').then(next())
        // next()
      } else {
      // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles
          store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
          // 测试 默认静态页面
          // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            // console.log(router, 'router')
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        })
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
