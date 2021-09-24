/*
 * @Descripttion:路由基础数据
 * @Author: zongmz
 * @Date: 2021-02-01 10:07:48
 * @LastEditors: peng
 * @LastEditTime: 2021-07-29 17:07:36
 */
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

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
const Redirect = () => import(/* webpackChunkName: "redirect" */ '@/view/redirect')
const Index = () => import(/* webpackChunkName: "index" */ '@/view/home')
// const WebsiteView = () => import(/* webpackChunkName: "website-view" */ '@/view/home/website-view')
// const IndexNext = () => import(/* webpackChunkName: "IndexNext" */ '@/view/home/next.vue')
const Login = () => import(/* webpackChunkName: "login" */ '@/view/login')
const E403 = () => import(/* webpackChunkName: "error" */ '@/layouts/exception/403')
const E404 = () => import(/* webpackChunkName: "error" */ '@/layouts/exception/404')
let routes = []
import routesData from './route-data'

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
    path: '/403',
    component: E403,
    hidden: true
  },
  {
    path: '/',
    name: 'Dynamic',
    component: Layout,
    redirect: '',
    children: [
      {
        path: 'website/:pageId',
        component: Index,
        showTags: false,
        hidden: true,
        name: 'website',
        meta: {
          title: '门户首页',
          icon: 'shouye',
          noCache: true,
          isSilder: false,
          affix: false
        }
      },
      {
        path: 'website-view',
        component: () => import(/* webpackChunkName: "website-view" */ '@/view/home/website-view'),
        showTags: false,
        hidden: false,
        name: 'website-view',
        meta: {
          title: '预览',
          icon: 'shouye',
          noCache: true,
          isSilder: false,
          affix: false
        }
      },
      {
        path: 'dragHome',
        component: () => import(/* webpackChunkName: "index" */ '@/view/home/dragHome/index.vue'),
        showTags: false,
        hidden: true,
        name: 'dragHome',
        meta: {
          title: '门户首页拖拽自定义',
          icon: 'shouye',
          noCache: true,
          isSilder: false,
          affix: false
        }
      }
    ]
  }
]

routes = constantRoutes.concat(routesData)
export default routes
