import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import SvgIcon from './svg'

// import './mock'
import './config/componentUse'
import './config/initConfig'
import './router/permission'
import IconFont from '@/components/IconFont'

import './components/global.less'

Vue.component('SvgIcon', SvgIcon)
Vue.component('IconFont', IconFont)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
