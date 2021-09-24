/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-25 15:04:54
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-09 22:46:37
 */
import { getToken, setToken } from '@/utils/auth'
import request from '@/utils/request'
const qs = require('qs')
const user = {
  state: {
    authToken: getToken()
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.authToken = token
    }
  },
  actions: {
    // 登入
    Login({ commit }, token) {
      const params = {
        ...qs.parse(location.hash.split('?')[1]),
        ...qs.parse(location.search.split('?')[1])
      }
      const data = {
        identifierCode: 'xxx',
        ticket: params['ticket'],
        service: `${process.env.VUE_APP_BASE_ADDRESS}`
      }
      return new Promise((resolve, reject) => {
        if (params['ticket']) {
          request({ url: 'user.ssoLogin', data: data }).then(res => {
            const { result, success } = res
            if (success) {
              commit('SET_TOKEN', result.token)
              setToken(result.token)
              const loca = window.location
              const newPath = `${loca.origin}${loca.pathname}${loca.hash}`
              window.location.href = newPath
              resolve(res)
            } else {
              window.location.href = `${process.env.VUE_APP_SSO_ADDRESS}/login?service=${encodeURI(window.location.href)}`
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve('no tiket')
        }
      })
    }
  }
}
export default user
