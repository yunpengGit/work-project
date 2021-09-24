import Vue from 'vue';
import Vuex from 'vuex';
import circulate from './circulate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mainId: '',
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    circulate,
  },
});
