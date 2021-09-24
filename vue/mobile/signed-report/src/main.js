/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-25 11:43:33
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-03-25 13:43:02
 */
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/style/base.less'
import { http } from '@/http'
import util from './util/index'
import { Lazyload } from 'vant'
import SvgIcon from './svg'
Vue.component('SvgIcon', SvgIcon)

Vue.use(Lazyload).use(SvgIcon)
Vue.use(util)

var bus = new Vue()
Vue.prototype.$bus = bus

Vue.prototype.$http = http
// Vue.prototype.$util = util

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
