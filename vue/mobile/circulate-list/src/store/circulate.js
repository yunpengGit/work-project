const circulate = {
  namespaced: true,
  state: {
    mainId: '',
    allCounts: '',
    readCounts: '',
    recallCounts: '',
    unreadCounts: '',
  },
  mutations: {
    setMainId: (state, str) => {
      state.mainId = str;
    },
  },
  actions: {
    setMainId({ commit }, str) {
      commit('setMainId', str);
    },
  },
};
export default circulate;
