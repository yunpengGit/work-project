/*
 * @Author: ruimeng
 * @Date: 2019-12-06 10:04:40
 * @Last Modified by: ruimeng
 * @Last Modified time: 2019-12-06 10:47:27
 */

const userInfo = {
  state: {
    userInfo: {},
    token: ''
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setToken (state, token) {
      state.token = token
    }
  },
  actions: {
    setUserInfo ({ commit }, userInfo) {
      commit('setUserInfo', userInfo)
    },
    setToken ({ commit }, token) {
      commit('setToken', token)
    }
  }
}

export { userInfo }
