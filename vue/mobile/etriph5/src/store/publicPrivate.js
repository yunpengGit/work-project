const publicPrivate = {
  state: {
    publicPrivateState: true
  },
  mutations: {
    changePublicPrivateState (state, is) {
      state.publicPrivateState = is
    }
  },
  actions: {
    changePublicPrivateState ({ commit }, is) {
      commit('changePublicPrivateState', is)
    }
  }
}

export {
  publicPrivate
}
