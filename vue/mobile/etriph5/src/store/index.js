import Vue from 'vue'
import Vuex from 'vuex'
import { loading } from './loading'
import { journeyList } from './journeyList'
import { journeyDetail } from './journeyDetail'
import { userInfo } from './userInfo'
import { publicPrivate } from './publicPrivate'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    journeyList,
    journeyDetail,
    userInfo,
    publicPrivate
  }
})
