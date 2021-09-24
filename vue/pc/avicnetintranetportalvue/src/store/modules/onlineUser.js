import api from '@/api-manage'
const onlineUser = {
  state: {
    onlineUserCount: 0
  },
  mutations: {
    SET_COUNT (state, count) {
      state.onlineUserCount = count
    }
  },
  actions: {
    getOnlineUserCount ({ commit }) {
      api.request('onlinePeople.orgTopTree').then((res) => {
        commit('SET_COUNT', res.data.onlineUserCount)
      })
    }
  }

}

export default onlineUser
