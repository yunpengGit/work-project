/**
 * Created by IntelliJ IDEA.
 * User: mengrv
 * DateTime: 2019/11/25 09:40
 */
const journeyList = {
  state: {
    showCheckbox: false,
    checkUsersEmails: [], // 选择人列表
    selectedUserIndex: 0, // 当前选择用户在checkUsersEmails中的索引值
    listParams: { // 列表请求参数
      tickettype: 0, // 0国内， 1国际
      pageNum: 0,
      pageSize: 10
    },
    params: {} // 下载的请求参数，不包含emails
  },
  mutations: {
    setShowCheckbox (state, show) {
      state.showCheckbox = show
    },
    setListParams (state, params) {
      state.listParams = params
    },
    setParams (state, params) { // 设置请求参数
      state.params = params
    },
    addCheckUserEmail (state, userEmail) { // 添加用户
      state.checkUsersEmails.push(userEmail)
    },
    addCheckUsersEmails (state, usersEmails) { // 添加用户列表
      state.checkUsersEmails = state.checkUsersEmails.concat(usersEmails)
    },
    clearCheckUsersEmails (state) { // 清除用户
      state.checkUsersEmails = []
    },
    setCheckUsersEmails (state, usersEmails) { // 设置用户列表
      state.checkUsersEmails = usersEmails
    },
    setSelectedUser (state, user) { // 设置选择人员
      state.checkUsersEmails[state.selectedUserIndex] = user.email
      state.selectedUser = user
    },
    setSelectedUserIndex (state, index) { // 设置选择人员索引
      state.selectedUserIndex = index
    }
  },
  actions: {
    setJourneyListShowCheckbox ({ commit }, show) {
      commit('setShowCheckbox', show)
    },
    clearCheckUsersEmails ({ commit }) {
      commit('clearCheckUsersEmails')
    },
    addCheckUserEmail ({ commit }, userEmail) {
      commit('addCheckUserEmail', userEmail)
    },
    addCheckUsersEmails ({ commit }, usersEmails) {
      commit('addCheckUsersEmails', usersEmails)
    },
    setCheckUsersEmails ({ commit }, usersEmails) {
      commit('setCheckUsersEmails', usersEmails)
    },
    setSelectedUser ({ commit }, user) {
      commit('setSelectedUser', user)
    },
    setSelectedUserIndex ({ commit }, index) {
      commit('setSelectedUserIndex', index)
    },
    clearListParams ({ commit }, params) {
      commit('setListParams', {
        tickettype: 0, // 0国内， 1国际
        pageNum: 0,
        pageSize: 10
      })
    },
    setListParams ({ commit }, params) {
      commit('setListParams', params)
    },
    setParams ({ commit }, params) {
      commit('setParams', params)
    }
  }
}

export {
  journeyList
}
