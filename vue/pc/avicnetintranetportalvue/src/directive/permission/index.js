/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-05-30 21:10:37
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-30 21:16:28
 */
import hasRole from './hasRole'
import hasPermi from './hasPermi'

const install = function (Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  Vue.use(install); // eslint-disable-line
}

export default install
