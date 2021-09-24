import Vue from 'vue'
import ApiManage from './axios/index'
import CAS from './axios/cas'
import filter from './axios/filter'

Vue.use(ApiManage)

const api = new ApiManage({
  debug: false,
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: process.env.VUE_APP_TIMEOUT,
  emulateJSON: false,
  cache: false
})

// CAS拦截器
api.use(CAS)

// 处理非101状态码的返回值
api.use(filter)

export default api

// 使用方法备注
// this.$api('test.cerolegroupList',{id:1,xx:2})  => /list/article/1?xx=2
// export const cerolegroupList = {
//     baseURL: process.env.VUE_APP_BASE_API,
//     method: 'GET',
//     url:'/cerolegroup/:id'
// }
