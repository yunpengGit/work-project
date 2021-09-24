/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-25 11:43:09
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-16 15:55:52
 */
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/style/base.less'
import '@/style/flex.less'
import { http } from '@/http'
import { Lazyload } from 'vant'
import SvgIcon from './icons/svg'

// if (process.env.NODE_ENV === 'production') {
//   const Vconsole = require('vconsole')
//   // eslint-disable-next-line
//   new Vconsole()
// }
Vue.component('SvgIcon', SvgIcon)

Vue.use(Lazyload).use(SvgIcon)
Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
