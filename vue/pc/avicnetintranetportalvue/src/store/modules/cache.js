const cache = {
  state: {
    events: []
  },
  mutations: {
    setCache: (state, object) => {
      state[object['key']] = object['data']
    },
    clearCache: (state, key) => {
      state[key] = null
    }
  }
}

export {
  cache
}
