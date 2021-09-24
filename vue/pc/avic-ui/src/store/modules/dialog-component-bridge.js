import { add, remove } from "@/utils/extends/utils/set";

const components = {};

const state = {
  list: []
};

const getters = {
  getDialogComponents: state => uid => {
    return components[uid];
  }
};

const mutations = {
  OPEN_DIALOG: (state, params) => {
    const uid = params.uid || "global";
    components[uid] = {
      component: params.component,
      props: params.props
    };
    add(state.list, uid);
  },
  CLOSE_DIALOG: (state, params) => {
    const uid = (params && params.uid) || "global";
    components[uid] = {
      component: null,
      props: null
    };
    remove(state.list, uid);
  }
};

export default {
  state,
  mutations,
  getters
};
