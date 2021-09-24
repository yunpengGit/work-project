const state = {
    sideBarOpened: true,
    alarmTableOpened: false
}

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sideBarOpened = !state.sideBarOpened
        // state.sidebar.withoutAnimation = false
        // if (state.sidebar.opened) {
        //     Cookies.set('sidebarStatus', 1)
        // } else {
        //     Cookies.set('sidebarStatus', 0)
        // }
    },
    TOGGLE_ALARMTABLE: state => {
        state.alarmTableOpened = !state.alarmTableOpened
    }
}

const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    toggleAlarmTable({ commit }) {
        commit('TOGGLE_ALARMTABLE')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
