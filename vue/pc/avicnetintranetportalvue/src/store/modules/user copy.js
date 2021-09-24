import api from '@/api-manage'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getItem, setItem, removeItem } from '@/utils/storage'
const qs = require('qs')

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    roles: '',
    permissions: [],
    info: {},
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
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_WEBSITE: (state, info) => {
      state.website = info
    }
  },

  actions: {
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 由于路径的参数有的追加到hash上，有的追加到search上，故采取合并的方式
        const params = {
          ...qs.parse(location.hash.split('?')[1]),
          ...qs.parse(location.search.split('?')[1])
        }

        function setUser () {
          const userInfo = JSON.parse(getItem('userInfo'))
          commit('SET_ID', userInfo && userInfo.userId)
          commit('SET_NAME', userInfo && userInfo.nickName)
          commit('SET_INFO', userInfo)
        }

        // 有ticket走登录接口
        if (params['ticket']) {
          let req = {
            ticket: params['ticket'],
            serverUrl: `${window.location.protocol}//${window.location.host}` + window.location.pathname
          }
          if (process.env.NODE_ENV === 'development') {
            req = { ...req, ...{
              devFlag: true
            }}
          }
          api.request('user.login', req).then(res => {
            if (res.code === 200) {
              setToken(res.data.access_token)
              setItem('userInfo', JSON.stringify(res.data.login_user.user))
              setUser()// 缓存用户信息
              // window.location.href = `${window.location.protocol}//${window.location.host}` + window.location.pathname
              resolve(res)
            } else {
              reject(res.data)
            }
          }).catch(error => {
            reject(error)
          })
        } else if (!params['ticket'] && !getItem('userInfo')) {
          // 如果在登录页面，则跳过不调用
          if (process.env.NODE_ENV === 'development') {
            resolve({})
            return false
          }
          // 如果本地没有userInfo存储，主动获取一下
          api.request('user.getInfo').then(res => {
            if (res.code === 200) {
              setItem('userInfo', JSON.stringify(res.user))
              commit('SET_PERMISSIONS', res.permissions)
              setUser()// 缓存用户信息
              // 获取该用户是否需要灰度
              resolve(res)
            } else {
              reject(res.data)
            }
          }).catch(error => {
            reject(error)
          })
        } else {
          setUser() // 缓存用户信息
          resolve({})
        }
      })
    },
    // 退出系统
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        api.request('user.logout', { fromPortalOrPlatForm: 'portal' }).then(res => {
          commit('SET_TOKEN', '')
          commit('SET_ID', '')
          commit('SET_NAME', '')
          commit('SET_INFO', '')
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
