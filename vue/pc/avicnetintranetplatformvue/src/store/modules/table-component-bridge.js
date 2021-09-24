/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-22 15:51:56
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-22 15:52:40
 */
const state = {
  time: 0,
  uid: 0
}

const mutations = {
  UPDATE_TABLE_DATA: (state, uid = 0) => {
    state.time = +new Date()
    state.uid = uid
  },
  UPDATE_ALL_TABLE_DATA: state => {
    state.time = +new Date()
    state.uid = 'UPDATE_ALL_TABLE_DATA'
  }
}

export default {
  state,
  mutations
}
