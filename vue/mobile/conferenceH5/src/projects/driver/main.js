import { store, App, Vue } from '@/commonMain'
import router from '@/router/driver'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
