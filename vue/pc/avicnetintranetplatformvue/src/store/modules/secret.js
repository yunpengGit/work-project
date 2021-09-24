/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:33:20
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-12 15:59:14
 */
import api from '@/api-manage'
const getSecretLevel = {
  state: {
    secretLevel: ''
  },
  mutations: {
    SET_SECRET (state, secret) {
      state.secretLevel = secret
    }
  },
  actions: {
    getSecretLevelFn ({ commit }) {
      api.request('common.getMj').then(res => {
        const data = res.data.map(v => {
          return {
            dictLabel: v.dictLabel,
            dictValue: v.dictValue
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
