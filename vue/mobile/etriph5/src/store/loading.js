/**
 * Created by IntelliJ IDEA.
 * User: mengrv
 * DateTime: 2019/11/20 17:26
 */
const loading = {
  state: {
    loadingNum: 0,
    isLoading: false
  },
  mutations: {
    changeLoadingNum (state, num) {
      state.loadingNum += num
      state.loadingNum = state.loadingNum < 0 ? 0 : state.loadingNum
      state.isLoading = !!state.loadingNum > 0
    }
  },
  actions: {
    addLoading ({ commit }) {
      commit('changeLoadingNum', 1)
    },
    removeLoading ({ commit }) {
      commit('changeLoadingNum', -1)
    },
    clearLoading ({ commit, state }) {
      commit('changeLoadingNum', -state.loadingNum)
    }
  }
}

export {
  loading
}
