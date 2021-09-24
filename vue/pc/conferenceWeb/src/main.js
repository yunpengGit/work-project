/*
 * @Descripttion: 
 * @Author: zhaohx
 * @Date: 2021-06-24 09:20:52
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-26 11:05:27
 */
// import Vue from 'vue/dist/vue.common.js'
import VueClipboard from 'vue-clipboard2'
import Vue from 'vue'

import 'element-ui/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
Vue.use(VueClipboard)
Vue.component(CollapseTransition.name, CollapseTransition)
import Element from 'element-ui'
// import electron from "electron"
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import service from '@/utils/request'
import { getConferenceTemplate } from '@/utils/conference-auth'
Vue.prototype.getConferenceTemplate = getConferenceTemplate

import {
    showLoading,
    closeLoading,
    showTextLoading,
    showViewLoading,
    closeViewLoading
} from '@/utils/loading'
Vue.prototype.showLoading = showLoading
Vue.prototype.closeLoading = closeLoading
Vue.prototype.showTextLoading = showTextLoading
Vue.prototype.showViewLoading = showViewLoading
Vue.prototype.closeViewLoading = closeViewLoading

import './icons'
import './permission'
import '@/directive/permission'
import global_variable from '@/utils/global_variable'
import qs from 'qs'
import axios from 'axios'
// import electron from 'electron'
import { formatTableCellData, formatOrgName } from '@/utils/index'
import { getFilePath } from '@/api/common'
Vue.use(Element, { size: 'small', zIndex: 3000 })
Vue.prototype.Global = global_variable
Vue.prototype.formatTableCellData = formatTableCellData
Vue.prototype.formatOrgName = formatOrgName
Vue.prototype.service = service
Vue.prototype.$axios = axios
// Vue.prototype.electron = electron
Vue.prototype.$qs = qs
Vue.config.productionTip = false
Vue.prototype.configDefaultTime = ['09:00:00', '18:00:00']
Vue.prototype.getFilePath = getFilePath

import CusTomTooltip from '@/components/common/custom-tooltip.vue'
Vue.component('CusTomTooltip', CusTomTooltip)

import TableEmptyImage from '@/components/common/tableEmptyImage.vue'
Vue.component('TableEmptyImage', TableEmptyImage)

import AttendeeInfomation from '@/components/common/attendeeInfomation.vue'
Vue.component('AttendeeInfomation', AttendeeInfomation)

import PhoneEncryption from '@/components/common/phone-encryption.vue'
Vue.component('PhoneEncryption', PhoneEncryption)
//
Vue.use({
  install (Vue, options) {
      Vue.prototype.$elRequire = global.elRequire;
      Vue.prototype.$childProcess = global.childProcess;
      Vue.prototype.$fs = global.fs;
      Vue.prototype.$rc = global.rc;
      
      Vue.prototype.$shell = global.shell;
      
      Vue.prototype.$electron = global.electron;
      Vue.prototype.$path = global.path;
      Vue.prototype.$ipc = global.ipcRenderer || {};
      Vue.prototype.$remote = window.remote;
  }
});
//
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
