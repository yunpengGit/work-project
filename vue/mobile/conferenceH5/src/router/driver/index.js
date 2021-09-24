/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: peng
 * @LastEditTime: 2021-07-07 17:20:35
 */
import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store/index.js'
import { constantRouterMap } from './router.config.js'

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
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // const isquery = Object.keys(to.query)
  // console.log(isquery)
  // // 所有参数都采用query形式，在push进route之前对key/value进行加密 解密在此执行 通过路由组件props将值传给业务组件
  // if (isquery.length) {
  //   isquery.forEach(ele => {
  //     to.query[router.app.$dec(ele)] = router.app.$dec(to.query[ele])
  //     delete to.query[ele]
  //   })
  // }
  // // 对限制页拦截→跳转登录页
  // if (!to.matched.some(ele => ele.meta.isNoAuth)) {
  //   if (!store.state.user.authToken) {
  //     next({ path: '/login' })
  //   } else {
  //     next()
  //   }
  // } else {
  //   next()
  // }
  next()
})

// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

export default router
