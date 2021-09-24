/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-31 18:13:47
 */
import { add, remove } from '@/components/utils/set'

const components = {}

const state = {
  list: []
}

const getters = {
  getDialogComponents: state => uid => {
    return components[uid]
  }
}

const mutations = {
  OPEN_DIALOG: (state, params) => {
    const uid = params.uid || 'global'
    components[uid] = {
      component: params.component,
      props: params.props
    }
    add(state.list, uid)
  },
  CLOSE_DIALOG: (state, params) => {
    const uid = (params && params.uid) || 'global'
    components[uid] = {
      component: null,
      props: null
    }
    remove(state.list, uid)
  }
}

export default {
  state,
  mutations,
  getters
}
