/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-19 15:26:12
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-27 19:22:26
 */
import api from '@/api-manage'
const getCanaryFlag = {
  state: {
    canaryFlag: ''
  },
  mutations: {
    SET_CANARYFLAG (state, count) {
      state.canaryFlag = count
    }
  },
  actions: {
    getCanaryFlagFn ({ commit }) {
      api.request('user.getCanaryFlag').then(res => {
        commit('SET_CANARYFLAG', res.data.canary)
      })
    }
  }
}

export default getCanaryFlag

