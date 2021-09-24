import Vue from 'vue'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN, USER_MODEL } from '@/store/mutation-types'
import { authorityRouter } from '@/utils/authorityRouter'
import { type } from '@/utils/objectType'
import { localRouterMap } from '@/router/routerConfig'

const user = {
  state: {
    nickname: '',
    avatar: '',
    token: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === 1000000) {
            const model = response.model
            Vue.ls.set(ACCESS_TOKEN, model.token, 2 * 60 * 60 * 1000)
            model.role = []
            Vue.ls.set(USER_MODEL, model, 2 * 60 * 60 * 1000)
            commit('SET_NICKNAME', model.employee.name)
            commit('SET_AVATAR', model.employee.avatarPath)
            commit('SET_TOKEN', model.token)
            commit('SET_INFO', model.employee)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch((e) => {
          reject(e)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        const model = data
        if (model.limitgroupList) {
          // const arr = authorityRouter(model.limitgroupList)
          const arr = authorityRouter(localRouterMap)
          const isArray = type('Array')
          if (isArray(arr)) {
            model.role.permissionList = arr
            commit('SET_ROLES', arr)
            commit('SET_INFO', model)
          } else {
            reject(arr)
          }
        } else {
          reject(new Error('getInfo: roles must be a non-null array !'))
        }
        // }
        resolve(data)
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        resolve()
        // logout(state.token).then(() => {
        //   resolve()
        // }).catch((e) => {
        //   reject(e)
        // }).finally(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   Vue.ls.remove(ACCESS_TOKEN)
        // })
      })
    }

  }
}

export default user
