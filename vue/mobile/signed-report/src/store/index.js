import Vue from 'vue'
import Vuex from 'vuex'
import { handleChosen } from './handleChosen'
import { handle } from './handle'
import { signedReport } from './signedReport'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    handle,
    handleChosen,
    signedReport
  }
})
