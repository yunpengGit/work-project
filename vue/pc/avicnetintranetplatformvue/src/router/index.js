/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-10 10:41:33
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
const Layout = () => import(/* webpackChunkName: "layout" */ '@/layout')
const E401 = () => import(/* webpackChunkName: "error" */ '@/views/error/401')
const E404 = () => import(/* webpackChunkName: "error" */ '@/views/error/404')
const Login = () => import(/* webpackChunkName: "login" */ '@/views/login')
const Index = () => import(/* webpackChunkName: "index" */ '@/views/index')
const Redirect = () => import(/* webpackChunkName: "redirect" */ '@/views/redirect')

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: Redirect
      }
    ]
  },
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    path: '/404',
    component: E404,
    hidden: true
  },
  {
    path: '/401',
    component: E401,
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: Index,
        name: '平台总览',
        meta: { title: '平台总览', icon: 'shouye', noCache: true, affix: true }
      }
    ]
  }
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to, res, rej) {
  if (res || rej) return VueRouterPush.call(this, to, res, rej)
  return VueRouterPush.call(this, to).catch(error => error)
}
