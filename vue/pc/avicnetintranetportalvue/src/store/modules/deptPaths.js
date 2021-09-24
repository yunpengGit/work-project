/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-19 15:26:12
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-29 16:34:26
 */
import api from '@/api-manage'
const getDeptPaths = {
  state: {
    deptPaths: []
  },
  mutations: {
    SET_DEPTPATH (state, count) {
      state.deptPaths = count
    }
  },
  actions: {
    getDeptPathFn ({ commit }) {
      api.request('common.getDeptPaths').then(res => {
        commit('SET_DEPTPATH', res.data)
      })
    }
  }
}

export default getDeptPaths

