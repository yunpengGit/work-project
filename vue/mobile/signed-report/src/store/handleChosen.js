const handleChosen = {
  state: {
    parentData: {},
    currentData: [],
    groupLeader: [],
    companyLeader: [],
    groupLeaderAssistant: [],
    otherDepartmentHandle: [],
    otherDepartmentCirculate: [],
    ownDepartmentHandle: [],
    groupTransferred: [],
    ownDepartmentCirculate: [],
    groupLeaderData: [],
    companyLeaderData: [],
    groupLeaderAssistantData: [],
    otherDepartmentHandleData: [],
    otherDepartmentCirculateData: [],
    ownDepartmentHandleData: [],
    groupTransferredData: [],
    ownDepartmentCirculateData: []
  },
  mutations: {
    setParentData (state, obj) {
      state.parentData = obj
    },
    setCurrentData (state, arr) {
      state.currentData = arr
    },
    setGroupLeader (state, arr) {
      state.groupLeader = arr
    },
    setCompanyLeader (state, arr) {
      state.companyLeader = arr
    },
    setGroupLeaderAssistant (state, arr) {
      state.groupLeaderAssistant = arr
    },
    setOtherDepartmentHandle (state, arr) {
      state.otherDepartmentHandle = arr
    },
    setOtherDepartmentCirculate (state, arr) {
      state.otherDepartmentCirculate = arr
    },
    setOwnDepartmentHandle (state, arr) {
      state.ownDepartmentHandle = arr
    },
    setGroupTransferred (state, arr) {
      state.groupTransferred = arr
    },
    setOwnDepartmentCirculate (state, arr) {
      state.ownDepartmentCirculate = arr
    },
    setGroupLeaderData (state, arr) {
      state.groupLeaderData = arr
    },
    setCompanyLeaderData (state, arr) {
      state.companyLeaderData = arr
    },
    setGroupLeaderAssistantData (state, arr) {
      state.groupLeaderAssistantData = arr
    },
    setOtherDepartmentHandleData (state, arr) {
      state.otherDepartmentHandleData = arr
    },
    setOtherDepartmentCirculateData (state, arr) {
      state.otherDepartmentCirculateData = arr
    },
    setOwnDepartmentHandleData (state, arr) {
      state.ownDepartmentHandleData = arr
    },
    setGroupTransferredData (state, arr) {
      state.groupTransferredData = arr
    },
    setOwnDepartmentCirculateData (state, arr) {
      state.ownDepartmentCirculateData = arr
    }
  },
  actions: {
    setParentData ({ commit }, obj) {
      commit('setParentData', obj)
    },
    setCurrentData ({ commit }, arr) {
      commit('setCurrentData', arr)
    },
    setGroupLeader ({ commit }, arr) {
      commit('setGroupLeader', arr)
    },
    setCompanyLeader ({ commit }, arr) {
      commit('setCompanyLeader', arr)
    },
    setGroupLeaderAssistant ({ commit }, arr) {
      commit('setGroupLeaderAssistant', arr)
    },
    setOtherDepartmentHandle ({ commit }, arr) {
      commit('setOtherDepartmentHandle', arr)
    },
    setOtherDepartmentCirculate ({ commit }, arr) {
      commit('setOtherDepartmentCirculate', arr)
    },
    setOwnDepartmentHandle ({ commit }, arr) {
      commit('setOwnDepartmentHandle', arr)
    },
    setGroupTransferred ({ commit }, arr) {
      commit('setGroupTransferred', arr)
    },
    setOwnDepartmentCirculate ({ commit }, arr) {
      commit('setOwnDepartmentCirculate', arr)
    },
    setGroupLeaderData ({ commit }, arr) {
      commit('setGroupLeaderData', arr)
    },
    setCompanyLeaderData ({ commit }, arr) {
      commit('setCompanyLeaderData', arr)
    },
    setGroupLeaderAssistantData ({ commit }, arr) {
      commit('setGroupLeaderAssistantData', arr)
    },
    setOtherDepartmentHandleData ({ commit }, arr) {
      commit('setOtherDepartmentHandleData', arr)
    },
    setOtherDepartmentCirculateData ({ commit }, arr) {
      commit('setOtherDepartmentCirculateData', arr)
    },
    setOwnDepartmentHandleData ({ commit }, arr) {
      commit('setOwnDepartmentHandleData', arr)
    },
    setGroupTransferredData ({ commit }, arr) {
      commit('setGroupTransferredData', arr)
    },
    setOwnDepartmentCirculateData ({ commit }, arr) {
      commit('setOwnDepartmentCirculateData', arr)
    }
  }
}

export {
  handleChosen
}
