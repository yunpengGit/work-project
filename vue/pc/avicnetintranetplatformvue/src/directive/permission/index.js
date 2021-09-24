import hasRole from './hasRole'
import hasPermi from './hasPermi'
import color from './color'

const install = function (Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('color', color)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['color'] = color
  Vue.use(install); // eslint-disable-line
}

export default install
