/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-19 15:51:16
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-30 19:22:49
 */
import Vue from 'vue'
import Router from 'vue-router'
import routes from '@/router/routes'
// import routesData from '@/router/route-data'
// import { getToken } from '@/utils/auth'
// import { getItem } from '@/utils/storage'
import store from './store'
const qs = require('qs')
// import api from '@/api-manage'
// import { permiseSetting, leadersWeekly } from '@/router/portal/leadersWeekly'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: routes
})

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to, res, rej) {
  if (res || rej) return VueRouterPush.call(this, to, res, rej)
  return VueRouterPush.call(this, to).catch(error => error)
}

router.beforeEach((to, from, next) => {
  // const token = getItem('Token')
  // const userInfo = getItem('userInfo')
  const params = {
    ...qs.parse(location.hash.split('?')[1]),
    ...qs.parse(location.search.split('?')[1])
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // console.log('====================================')
  // console.log(token, 29292)
  // console.log('====================================')
  if (params['ticket']) {
    store.dispatch('GetInfo')
    next()
  } else {
    if (process.env.NODE_ENV === 'development') {
      window.location.href = 'https://idaas-sso.avicnet.cn/authn-api/v5/cas/101064129153019904/login?service=https://dev-portal.avic.com:8083'
      // next()
    } else {
      // store.dispatch('GetInfo')
      next()
    }
  }
  // if (token && userInfo) {
  //   store.dispatch('getWebSite').then(res => {
  //     console.log('====================================')
  //     console.log(333)
  //     console.log('====================================')
  //     const websiteInfo = res.data[0]
  //     // router = router.options.routes.find(v => v.name === 'Dynamic')
  //     if (websiteInfo && websiteInfo.sitePages.length) {
  //       console.log('====================================')
  //       console.log(453)
  //       console.log('====================================')
  //       router.addRoute('Dynamic', )
  //     // router.options.routes.find(v => v.name === 'Dynamic').children.splice(1, 1)
  //     } else {
  //       console.log('====================================')
  //       console.log(777)
  //       console.log('====================================')
  //       router.addRoute('Dynamic', {
  //         path: 'website/:pageId',
  //         component: (resolve) => require([`@/view/home`], resolve),
  //         showTags: true,
  //         hidden: false,
  //         name: 'website',
  //         meta: {
  //           title: '门户首页',
  //           icon: 'shouye',
  //           noCache: true,
  //           isSilder: false,
  //           affix: true
  //         }
  //       })
  //       router.addRoute('Dynamic', {
  //         path: 'home',
  //         component: (resolve) => require([`@/view/home`], resolve),
  //         showTags: true,
  //         hidden: false,
  //         name: 'home',
  //         meta: {
  //           title: '门户首页',
  //           icon: 'shouye',
  //           noCache: true,
  //           isSilder: false,
  //           affix: true
  //         }
  //       })
  //     // router.options.routes.find(v => v.name === 'Dynamic').children.splice(0, 1)
  //     }
  //     if (to.path === '/' || to.path === '/home') {
  //       if (websiteInfo && websiteInfo.sitePages.length) {
  //         to.matched[0].redirect = websiteInfo.siteUrl
  //       } else {
  //         to.matched[0].redirect = '/home'
  //       }
  //       next({ ...to, replace: true })
  //     } else {
  //       next()
  //     }
  //   })
  // } else {
  //   if (params['ticket']) {
  //     store.dispatch('GetInfo').then(res => {
  //       console.log('====================================')
  //       console.log(res, 88222, getItem('Token'))
  //       console.log('====================================')
  //       store.dispatch('getSecretLevelFn')
  //       //   store.dispatch('getCanaryFlagFn')
  //       //   store.dispatch('getDeptPathFn')
  //     })
  //     setTimeout(() => {
  //       next()
  //     }, 200)
  //   } else {
  //     if (process.env.NODE_ENV === 'development') {
  //       window.location.href = 'https://idaas-sso.avicnet.cn/authn-api/v5/cas/101064129153019904/login?service=https://dev-portal.avic.com:8083'
  //       // next()
  //     } else {
  //       // store.dispatch('GetInfo')
  //       next()
  //     }
  //   }
  // }

  // if (process.env.NODE_ENV === 'development') {
  //   next({ path: '/login' })
  // }

  // if (params['ticket']) {
  //   console.log('====================================')
  //   console.log(111)
  //   console.log('====================================')
  //   store.dispatch('GetInfo')
  //   next()
  // } else {
  //   console.log('====================================')
  //   console.log(222)
  //   console.log('====================================')
  //   if (token && userInfo) {
  //     next()
  //   } else {
  //     store.dispatch('GetInfo')
  //     next()
  //   }
  // }
})

export default router
