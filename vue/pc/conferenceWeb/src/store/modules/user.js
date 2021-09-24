import { login, getUser, logout, ssoLogin } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/user-auth'

import { setConferenceId } from '@/utils/conference-auth'

const state = {
    token: getToken(),
    users: {
        userId: ''
        // ssoPhoto: ''
    },
    conferenceId: null,
    conferenceName: null,
    loading: null
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },

    SET_USERS: (state, user) => {
        state.users.userId = user.id
        // state.users.ssoPhoto = user.ssoPhoto
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {
    login({ commit }, user) {
        return new Promise((resolve, reject) => {
            login(user).then(res => {
                const { result } = res
                commit('SET_TOKEN', result.token)
                setToken(result.token)
                getUser(state.token).then(res1 => {
                    const result1 = res1.result
                    if (!result1) {
                        reject('验证失败， 请重新登录')
                    }
                    commit('SET_USERS', result1)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
    ssoLogin({ commit }, user) {
        return new Promise((resolve, reject) => {
            ssoLogin(user).then(res => {
                const { result } = res
                commit('SET_TOKEN', result.token)
                setToken(result.token)
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getUser({ commit, state }) {
        return new Promise((resolve, reject) => {
            getUser(state.token).then(res => {
                const { result } = res
                if (!result) {
                    reject('验证失败， 请重新登录')
                }
                commit('SET_USERS', result)
                resolve(result)
            }).catch(err => {
                setConferenceId('')
                reject(err)
            })
        })
    },
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_USERS', { id: '' })
                removeToken()
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
