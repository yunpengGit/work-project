import Vue from 'vue'
// import router from './router'
import source from './source'
import { http } from './http'
import './../../style/base.css'
import '../../svg/iconfont'

Vue.config.productionTip = false
Vue.prototype.$http = http

new Vue({
  // router,
  render: h => h(source)
}).$mount('#app')
