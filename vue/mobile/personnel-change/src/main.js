/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-26 15:48:10
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-02 10:26:37
 */
import Vue from 'vue'
import App from './App'

import { Search, Tab, Tabs, List } from 'vant'

Vue.use(Search)
  .use(Tab)
  .use(Tabs)
  .use(List)

new Vue({
  el: '#app',
  render: h => h(App)
})
