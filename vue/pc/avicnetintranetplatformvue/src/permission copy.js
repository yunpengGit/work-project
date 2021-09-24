/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-19 16:03:52
 */
import router from './router'
import store from './store'
// import { Message } from '@avic/golden-pc-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
const qs = require('qs')

NProgress.configure({ showSpinner: false })

// const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
const token = getToken()
const params = {
  ...qs.parse(location.hash.split('?')[1]),
  ...qs.parse(location.search.split('?')[1])
}

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  NProgress.start()
  if (process.env.NODE_ENV === 'development' && !token && !params['ticket']) {
    // next({ path: '/login' })
    window.location.href = 'https://idaas-sso.avicnet.cn/authn-api/v5/cas/108704637497569280/login?service=https://dev-portal.avic.com:8083'
    NProgress.done()
  } else {
    // const userInfo = store.getters.userInfo
    if (store.getters.roles.length) {
      next()
    } else {
      if (!token) {
        store.dispatch('Login')
        next()
      } else {
      // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles
          store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
          // 测试 默认静态页面
          // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            console.log(router, 'router')
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
