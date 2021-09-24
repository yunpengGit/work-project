/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-06-28 17:44:55
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-28 17:46:05
 */
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: routes
})

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to, res, rej) {
  if (res || rej) return VueRouterPush.call(this, to, res, rej)
  return VueRouterPush.call(this, to).catch(error => error)
}
