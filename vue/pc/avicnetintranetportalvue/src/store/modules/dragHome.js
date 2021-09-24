/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-30 16:03:06
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-05-30 16:32:17
 */
const state = {
  informationNum: 0
}

const mutations = {
  INFORMATION_NUM (state, num) {
    state.informationNum = num
  }
}

const actions = {
  SetInformationNum ({ commit }, num) {
    commit('INFORMATION_NUM', num)
  }
}

export default {
  // namespaced: true,
  state,
  mutations,
  actions
}
