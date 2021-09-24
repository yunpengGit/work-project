/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-20 11:07:43
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-07 18:18:16
 */
import { store, App, Vue } from '@/commonMain'
import router from '@/router/conference'
// Vue.prototype.$findEle = function(parendNode, node) {
//   if (!parendNode || !node) {
//     return false
//   }
//   let result = null
//   const recursFunc = (parendNode, node) => {
//     const childNode = parendNode.childNodes
//     if (!childNode.length) {
//       return
//     }
//     for (let i = 0; i < childNode.length; i++) {
//       if (Array.from(childNode[i].classList).includes(node)) {
//         result = childNode[i]
//         return
//       } else {
//         recursFunc(childNode[i], node)
//       }
//     }
//   }
//   recursFunc(parendNode, node)
//   return result
// }

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
