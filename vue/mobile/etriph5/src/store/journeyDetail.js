const journeyDetail = {
  state: {
    isOrderSendEmail: false
  },
  mutations: {
    changeOrderSendEmail (state, is) {
      state.isOrderSendEmail = is
    }
  },
  actions: {
    changeOrderSendEmail ({ commit }, is) {
      commit('changeOrderSendEmail', is)
    }
  }
}

export {
  journeyDetail
}
