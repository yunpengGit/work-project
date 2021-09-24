/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:33:20
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-31 14:09:07
 */
import api from '@/api-manage'
const onlineUser = {
  state: {
    onlineUserCount: 0
  },
  mutations: {
    SET_COUNT (state, count) {
      state.onlineUserCount = count
    }
  },
  actions: {
    getOnlineUserCount ({ commit }) {
      api.request('common.orgTopTree').then((res) => {
        commit('SET_COUNT', res.data.onlineUserCount)
      })
    }
  }

}

export default onlineUser
