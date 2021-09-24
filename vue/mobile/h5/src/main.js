/*
 * @Author: your name
 * @Date: 2020-10-13 13:49:42
 * @LastEditTime: 2020-10-30 14:31:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import SvgIcon from './icons/svg/index.vue'
import './icons/iconfont'
import 'lib-flexible'
import changePageTitle from '@/utils/changePageTitle'

import '@/config/commonImport'
import './config/initConfig'

Vue.component('SvgIcon', SvgIcon)
Vue.use(SvgIcon)

Vue.prototype.$changePageTitle = changePageTitle

Vue.config.productionTip = false
Vue.config.$loaddingShow = false

new Vue({
  router: router,
  store,
  render: (h) => h(App)
}).$mount('#app')
