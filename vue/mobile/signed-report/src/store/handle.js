const handle = {
  state: {
    degree: '3',
    processId: '',
    complaint: [],
    showComplaintDer: false,
    transferredStatus: 'false',
    transferredOpinion: {},
    breadcrumbs: [{ name: '组织架构', id: '' }],
    roleType: '',
    subsidiaryCompany: false,
    auditNote: '',
    notUpdateMsg: false
  },
  mutations: {
    setDegree (state, str) {
      state.degree = str
    },
    setProcessId (state, str) {
      state.processId = str
    },
    setComplaint (state, str) {
      state.complaint = str
    },
    setShowComplaintDer (state, Boolean) {
      state.showComplaintDer = Boolean
    },
    setTransferredStatus (state, Boolean) {
      state.transferredStatus = Boolean
    },
    setTransferredOpinion (state, obj) {
      state.transferredOpinion = obj
    },
    setBreadcrumbs (state, arr) {
      state.breadcrumbs = arr
    },
    setRoleType (state, str) {
      state.roleType = str
    },
    setSubsidiaryCompany (state, Boolean) {
      state.subsidiaryCompany = Boolean
    },
    setAuditNote (state, str) {
      state.auditNote = str
    },
    setNotUpdateMsg (state, Boolean) {
      state.notUpdateMsg = Boolean
    }
  },
  actions: {
    setDegree ({ commit }, str) {
      commit('setDegree', str)
    },
    setProcessId ({ commit }, str) {
      commit('setProcessId', str)
    },
    setComplaint ({ commit }, str) {
      commit('setComplaint', str)
    },
    setShowComplaintDer ({ commit }, Boolean) {
      commit('setShowComplaintDer', Boolean)
    },
    setTransferredStatus ({ commit }, Boolean) {
      commit('setTransferredStatus', Boolean)
    },
    setTransferredOpinion ({ commit }, obj) {
      commit('setTransferredOpinion', obj)
    },
    setBreadcrumbs ({ commit }, arr) {
      commit('setBreadcrumbs', arr)
    },
    setRoleType ({ commit }, str) {
      commit('setRoleType', str)
    },
    setSubsidiaryCompany ({ commit }, Boolean) {
      commit('setSubsidiaryCompany', Boolean)
    },
    setAuditNote ({ commit }, str) {
      commit('setAuditNote', str)
    },
    setNotUpdateMsg ({ commit }, Boolean) {
      commit('setNotUpdateMsg', Boolean)
    }
  }
}
export {
  handle
}
