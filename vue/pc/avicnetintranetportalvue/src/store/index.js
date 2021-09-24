/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-18 18:23:19
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-28 17:00:13
 */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import onlineUser from './modules/onlineUser'
// import canary from './modules/canary'
import deptPaths from './modules/deptPaths'
import dragHome from './modules/dragHome'
import table from './modules/table-component-bridge'
import tagsView from './modules/tagsView'
import settings from './modules/settings'
import mqtt from './modules/mqtt'
import { cache } from './modules/cache'
import secret from './modules/secret'

Vue.use(Vuex)

const options = {
  modules: {
    app,
    user,
    onlineUser,
    // canary,
    deptPaths,
    dragHome,
    table,
    cache,
    tagsView,
    settings,
    mqtt,
    secret
  },
  getters
}

export default new Vuex.Store(options)
