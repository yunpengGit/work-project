import api from '@/api-manage'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setItem, removeItem } from '@/utils/storage'
const qs = require('qs')
import store from '@/store'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    roles: '',
    permissions: [],
    userInfo: {},
    website: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_WEBSITE: (state, info) => {
      state.website = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const params = {
        ...qs.parse(location.hash.split('?')[1]),
        ...qs.parse(location.search.split('?')[1])
      }
      let data = {
        ticket: params['ticket'],
        serverUrl: `${window.location.protocol}//${window.location.host}` + window.location.pathname
      }
      if (process.env.NODE_ENV === 'development') {
        data = { ...data, ...{
          devFlag: true
        }}
      }
      return new Promise((resolve, reject) => {
        if (params['ticket']) {
          // console.log('====================================')
          // console.log(api, 22222)
          // console.log('====================================')
          api.request('user.login', data).then(res => {
            if (res.code === 200) {
              commit('SET_PERMISSIONS', res.data.login_user.permissions)
              // sessionStorage存储用户信息
              commit('SET_USERINFO', res.data.login_user.user)
              setItem('userInfo', JSON.stringify(res.data.login_user.user))
              setItem('permissions', JSON.stringify(res.data.login_user.permissions))
              // 存储用户token
              setToken(res.data.access_token)
              commit('SET_TOKEN', res.data.access_token)
              // 跳转去除ticket参数
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
          const permissions = store.getters.permissions
          commit('SET_USERINFO', userInfo)
          commit('SET_PERMISSIONS', store.getters.permissions)
          setItem('userInfo', JSON.stringify(userInfo))
          setItem('permissions', JSON.stringify(permissions))
          resolve({})
        }
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        api.request('user.getInfo').then(res => {
          commit('SET_PERMISSIONS', res.permissions)
          const user = res.user
          setItem('userInfo', JSON.stringify(user))
          commit('SET_USERINFO', user)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出系统
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        api.request('user.logout', { fromPortalOrPlatForm: 'portal' }).then(res => {
          commit('SET_TOKEN', '')
          commit('SET_ID', '')
          commit('SET_NAME', '')
          commit('SET_USERINFO', '')
          removeItem('userInfo')
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getWebSite ({ commit }) {
      return new Promise((resolve, reject) => {
        api.request('home.siteUserList').then(res => {
          commit('SET_WEBSITE', res.data)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
