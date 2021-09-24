/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-12 14:29:23
 */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import table from './modules/table-component-bridge'
import dialog from './modules/dialog-component-bridge'
import onlineUser from './modules/onlineUser'
import secret from './modules/secret'
import {
  cache
} from './modules/cache'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    settings,
    permission,
    onlineUser,
    cache,
    table,
    dialog,
    secret
  },
  getters
})

export default store
