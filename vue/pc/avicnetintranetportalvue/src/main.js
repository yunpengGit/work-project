/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 18:33:30
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-28 17:50:32
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api-manage'
import permission from './directive/permission'
import './permission'
// import './rem.js'
import './ui'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
Vue.config.productionTip = false
Vue.use(permission)

new Vue({
  api,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
