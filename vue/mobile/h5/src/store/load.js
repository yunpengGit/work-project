/*
 * @Author: your name
 * @Date: 2020-10-19 17:32:31
 * @LastEditTime: 2020-10-20 00:14:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\store\loading.js
 */
const loading = {
  state: {
    isLoading: false
  },
  mutations: {
    changeLoadingNum (state, bool) {
      state.isLoading = bool
    }
  },
  actions: {
    addLoading ({ commit }) {
      commit('changeLoadingNum', true)
    },
    removeLoading ({ commit }) {
      commit('changeLoadingNum', false)
    }
  }
}

export default loading
