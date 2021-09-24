/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-08-24 15:20:01
 */
import router from './router'
// const Index = () => import(/* webpackChunkName: "index" */ '@/view/home')
import store from './store'
// import { getItem } from '@/utils/storage'
const qs = require('qs')
// import { Message } from '@avic/golden-pc-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const token = getToken()
const params = {
  ...qs.parse(location.hash.split('?')[1]),
  ...qs.parse(location.search.split('?')[1])
}
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (!token && to.path !== '/') {
    next('/')
  }
  NProgress.start()
  // console.log('====================================')
  // console.log(token, 29292)
  // console.log('====================================')
  if (process.env.NODE_ENV === 'development' && !token && !params['ticket']) {
    // alert(10)
    window.location.href = 'https://idaas-sso.avicnet.cn/authn-api/v5/cas/101064129153019904/login?service=https://dev-portal.avic.com:8083'
    NProgress.done()
    return
  } else {
    // const userInfo = getItem('userInfo')
    if (params['ticket'] || !token) {
      store.dispatch('Login').then(() => {
        setTimeout(() => {
          store.dispatch('getWebSite').then(data => {
            NProgress.done()
            const websiteInfo = data.data[0]
            if (to.path === '/' || to.path === '/home') {
              if (websiteInfo && websiteInfo.sitePages.length) {
                to.matched[0].redirect = websiteInfo.siteUrl
              } else {
                to.matched[0].redirect = '/home'
              }
              next({ ...to, replace: true })
            } else {
              next()
            }
          })
        }, 500)
      })
    } else {
      store.dispatch('getWebSite').then(data => {
        NProgress.done()
        const websiteInfo = data.data[0]
        if (to.path === '/' || to.path === '/home') {
          if (websiteInfo && websiteInfo.sitePages.length) {
            to.matched[0].redirect = websiteInfo.siteUrl
          } else {
            to.matched[0].redirect = '/home'
          }
          next({ ...to, replace: true })
        } else {
          next()
        }
      })
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
