/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-10 03:21:14
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index.js'
import { constantRouterMap } from './router.config.js'
import { getToken } from '@/utils/auth'
import Watermark from '@/utils/watermark'
const qs = require('qs')

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const createRouter = () =>
  new Router({
    // mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
    // base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })

const router = createRouter()
const params = {
  ...qs.parse(location.hash.split('?')[1]),
  ...qs.parse(location.search.split('?')[1])
}
// const waterMark = []
router.beforeEach((to, from, next) => {
  // 每次路由切换时判断水印是否显示
  if (to.meta.waterMark) {
    sessionStorage.getItem('userBasicInfo') && Watermark.set(sessionStorage.getItem('userBasicInfo'))
  } else {
    Watermark.set('')
  }
  document.title = to.meta.title || ''
  const isquery = Object.keys(to.query)
  // 所有参数都采用query形式，在push进route之前对key/value进行加密 解密在此执行 通过路由组件props将值传给业务组件
  try {
    if (isquery.length) {
      isquery.forEach(ele => {
        to.query[router.app.$dec(ele)] = router.app.$dec(to.query[ele])
        delete to.query[ele]
      })
    }
  } catch (err) {
    try {
      isquery.forEach(ele => {
        to.query[decodeURI(router.app.$dec(decodeURIComponent(ele)))] = router.app.$dec(decodeURI(decodeURIComponent(to.query[ele])))
        delete to.query[ele]
      })
    } catch (err) {
      // const url = process.env.VUE_APP_BASE_ADDRESS
      // window.location.href = url
    }
  }
  const token = getToken()
  if (process.env.NODE_ENV === 'development' && !token && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    if (params['ticket']) {
      store.dispatch('Login').then(() => {
        next()
      })
    } else {
      if (!token) {
        store.dispatch('Login').then(() => {
          next()
        })
      } else {
        next()
      }
    }
  }
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
