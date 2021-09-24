/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-25 15:04:54
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-31 11:31:10
 */
import { getToken, setToken, removeToken } from '@/utils/auth'
import request from '@/utils/request'
const attendeeUser = {
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
      return new Promise((resolve, reject) => {
        setToken(token)
        commit('SET_TOKEN', token)
        request({
          url: 'user.userInfo',
          authToken: token
        }).then(res => {
          const userInfo = res.result
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 登出
    LoginOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        localStorage.clear()
        sessionStorage.clear()
        removeToken()
        resolve()
      })
    }
  }

}
export default attendeeUser
