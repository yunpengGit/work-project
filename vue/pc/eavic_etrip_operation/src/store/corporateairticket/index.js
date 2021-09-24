const corporateairticket = {
  namespaced: true,
  state: {
    company: ''
  },
  mutations: {
    setCompany (state, obj) {
      state.company = obj
    }
  },
  actions: {
    setCompany ({ commit }, obj) {
      commit('setCompany', obj)
    }
  }
}

export default corporateairticket
