const signedReport = {
  state: {
    receivedOrPost: '',
    tabActive: 0,
    filterParamsData: '',
    searchText: ''
  },
  mutations: {
    setReceivedOrPost (state, str) {
      state.receivedOrPost = str
    },
    setTabActive (state, num) {
      state.tabActive = num
    },
    setFilterParamsData (state, obj) {
      state.filterParamsData = obj
    },
    setSearchText (state, str) {
      state.searchText = str
    }
  },
  actions: {
    setReceivedOrPost ({ commit }, str) {
      commit('setReceivedOrPost', str)
    },
    setTabActive ({ commit }, num) {
      commit('setTabActive', num)
    },
    setFilterParamsData ({ commit }, obj) {
      commit('setFilterParamsData', obj)
    },
    setSearchText ({ commit }, str) {
      commit('setSearchText', str)
    }
  }
}

export {
  signedReport
}
