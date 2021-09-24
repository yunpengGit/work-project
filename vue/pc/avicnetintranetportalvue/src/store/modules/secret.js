/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:33:20
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-27 11:23:00
 */
import api from '@/api-manage'
const getSecretLevel = {
  state: {
    secretLevel: []
  },
  mutations: {
    SET_SECRET (state, count) {
      state.secretLevel = count
    }
  },
  actions: {
    getSecretLevelFn ({ commit }) {
      api.request('common.getMj').then(res => {
        const data = res.data.map(v => {
          return {
            dictLabel: v.dictLabel,
            dictValue: Number(v.dictValue)
          }
        })
        setTimeout(() => {
          commit('SET_SECRET', data)
        }, 10)
      })
    }
  }
}

export default getSecretLevel
