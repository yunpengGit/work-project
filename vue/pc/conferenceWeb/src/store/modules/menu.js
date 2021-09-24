import { constantRoutes, createRoutes } from '@/router'
import { getMenus, getMenusNotTree, getButtons } from '@/api/login'
import { getConferenceId } from '@/utils/conference-auth'
// import { toLocaleString } from 'core-js/fn/number/epsilon'

const state = {
    routes: [],
    addRoutes: [],
    routeNotTreeList: [],
    routeCodes: [],
    buttons: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    },
    SET_ROUTES_NOT_TREE: (state, routes) => {
        state.routeNotTreeList = routes
        state.routeCodes = []
        if (routes !== null) {
            routes.forEach(item => {
                state.routeCodes.push(item.resKey)
            })
        }
    },
    SET_BUTTON: (state, buttons) => {
        state.buttons = buttons
        // if (routes !== null) {
        //     routes.forEach(item => {
        //         state.routeCodes.push(item.resKey)
        //     })
        // }
    }
}

const actions = {
    generateRoutes({ commit }) {
        return new Promise(resolve => {
            getMenus({ 'conferenceId': getConferenceId(), 'platformType': 1 }).then(res => {
                if (res.code === 2000) {
                    const { result } = res
                    createRoutes(result)

                    commit('SET_ROUTES', result)
                    resolve(result)
                }
            })
        })
    },
    getMenus({ commit }) {
        return new Promise(resolve => {
            getMenusNotTree({ 'conferenceId': getConferenceId(), 'platformType': 1 }).then(res => {
                if (res.code === 2000) {
                    commit('SET_ROUTES_NOT_TREE', res.result)
                    resolve(res.result)
                }
            })
        })
    },
    getButtons({ commit }) {
        return new Promise(resolve => {
            getButtons({ 'conferenceId': getConferenceId(), 'platformType': 1 }).then(res => {
                if (res.code === 2000) {
                    commit('SET_BUTTON', res.result)
                    resolve(res.result)
                } else {
                    commit('SET_BUTTON', [])
                    resolve(res.result)
                }
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
