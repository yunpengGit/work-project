import api from '@/api-manage'
import { getToken, setToken, removeToken } from '@/utils/auth'
const qs = require('qs')
import store from '@/store'

const user = {
  state: {
    token: getToken(),
    userInfo: null,
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const params = {
        ...qs.parse(location.hash.split('?')[1]),
        ...qs.parse(location.search.split('?')[1])
      }
      const data = {
        ticket: params['ticket'],
        serverUrl: `${window.location.protocol}//${window.location.host}` + window.location.pathname
      }
      return new Promise((resolve, reject) => {
        // 有ticket走登录接口
        if (params['ticket']) {
          api.request('common.login', data).then(res => {
            if (res.code === 200) {
              commit('SET_USERINFO', res.data.login_user.user)
              setToken(res.data.access_token)
              commit('SET_TOKEN', res.data.access_token)
              window.location.href = `${window.location.protocol}//${window.location.host}` + window.location.pathname
              resolve(res)
            } else {
              reject(res.data)
            }
          }).catch(error => {
            reject(error)
          })
        } else if (!params['ticket'] && !store.getters.userInfo) {
          // 如果在登录页面，则跳过不调用
          if (process.env.NODE_ENV === 'development') {
            resolve({})
            return
          }
          store.dispatch('GetInfo')
        } else {
          // 缓存用户信息
          const userInfo = store.getters.userInfo
          commit('SET_USERINFO', userInfo)
          resolve({})
        }
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        api.request('common.getInfo').then(res => {
          const user = res.user
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_USERINFO', user)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.request('common.logout', { fromPortalOrPlatForm: 'platform' }).then(res => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
