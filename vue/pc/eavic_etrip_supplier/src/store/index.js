import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import order from './order'
import permission from './permission'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    order,
    user,
    permission
  },
  getters
})
