/*
 * @Author: your name
 * @Date: 2020-01-13 09:58:28
 * @LastEditTime: 2020-11-27 16:55:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mobile-vue-multiple-pages\src\views\schedule\main.js
 */
import Vue from 'vue'
import router from './router'
import SvgIcon from './../../icons/svg/index.vue'
import './../../icons/iconfont'
import schedule from './schedule'
import { http } from './http'
import './../../style/base.css'

Vue.component('SvgIcon', SvgIcon)
Vue.use(SvgIcon)

Vue.config.productionTip = false
Vue.prototype.$http = http

new Vue({
  router,
  render: h => h(schedule)
}).$mount('#app')
