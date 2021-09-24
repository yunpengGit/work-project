/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-29 10:24:59
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-29 11:11:14
 */
const mqtt = {
  state: {
    isLink: false
  },
  mutations: {
    SET_IS_LINK: (state, isLink) => {
      state.isLink = isLink
    }
  },
  actions: {
    changeIsLink ({ commit }, isLink) {
      commit('SET_IS_LINK', isLink)
    }
  }
}
export default mqtt
