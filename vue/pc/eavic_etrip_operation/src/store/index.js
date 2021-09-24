import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import permission from './permission'
import getters from './getters'
import supplier from './supplier/index'
import corporateairticket from './corporateairticket/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    permission,
    supplier,
    corporateairticket
  },
  getters
})
