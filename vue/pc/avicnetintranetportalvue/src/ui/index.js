/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-19 11:51:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-26 10:32:45
 */
import Vue from 'vue'
import ElementUI from '@avic/golden-pc-ui'
import Pagination from '../components/Pagination'
import ScreenForm from '../components/SpForm'
import SimpleTable from '../components/SpTable'
// import SimpleDialog from './extends/dialog/simple'

Vue.component('sp-pagination', Pagination(Vue, ElementUI))
Vue.component('sp-form', ScreenForm(Vue, ElementUI))
Vue.component('sp-table', SimpleTable(Vue, ElementUI))
// Vue.component('sp-dialog', SimpleDialog(Vue, Element))

// ui变量
import './var.scss'

// 公用样式
import './common.scss'
// 浏览器重置
import './normalize.css'
// 快捷样式
import './zxx.css'
// 框架样式
import './layout.scss'
// 重置UI样式

import './custom.scss'

ElementUI.Dialog.props.closeOnClickModal.default = false
ElementUI.Dialog.props.modalAppendToBody.default = false

Vue.use(ElementUI, {
  size: window.localStorage.getItem('dataTheme') || 'mini' // set element-ui default size
})
