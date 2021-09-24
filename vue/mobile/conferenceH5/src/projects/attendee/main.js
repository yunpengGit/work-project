/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-09-06 14:11:21
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-07 18:37:42
 */
import { store, App, Vue } from '@/commonMain'
import router from '@/router/attendee'
const jsapi = new JsApi()
jsapi.checkEnvironment()
setTimeout(() => {
  // Dialog({ message: jsapi.checkEnvironment() })
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}, 600)
// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })
