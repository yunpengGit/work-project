/*
 * @Author: your name
 * @Date: 2021-07-05 17:14:23
 * @LastEditTime: 2021-08-31 14:51:13
 * @LastEditors: zhaohx
 * @Description: In User Settings Edit
 * @FilePath: \conferenceH5\src\commonMain.js
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import service from '@/utils/request'
import { Base64 } from 'js-base64'

// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 引入全局样式
import '@/assets/css/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'
// 引入swiper样式
import 'swiper/dist/css/swiper.css'

// filters
import './filters'
Vue.config.productionTip = false
Vue.prototype.$api = service
// Vue.prototype.$Base64 = Base64
// 对路由参数进行加密/解密
Vue.prototype.$enc = obj => obj instanceof Object ? Base64.encode(JSON.stringify(obj)) : Base64.encode(obj)
Vue.prototype.$dec = obj => obj instanceof Object ? JSON.parse(Base64.decode(obj)) : Base64.decode(obj)
// 格式化时间格式
Vue.prototype.$format = date => date.replace(/-/g, '/')
export {
  Vue,
  store,
  App
}
