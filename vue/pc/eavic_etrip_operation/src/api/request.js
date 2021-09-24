import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
// import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
// import qs from 'qs'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
// * 使用axios.create请求时需要注意：get，post传参方式
// * get: params
// * post: data
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.model && data.model.isLogin)) {
      notification.error({
        message: '信息',
        description: 'token失效，重新登录'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['App-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  // 请求后更新token有效时间
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    Vue.ls.set(ACCESS_TOKEN, token, 2 * 60 * 60 * 1000)
  }
  // 统一处理请求响应异常信息提示
  if (response.data.code !== 1000000) {
    notification.error({
      message: '错误提示',
      description: response.data.resultStr
    })
  }
  return response.data
}, err)

// const installer = {
//   vm: {},
//   install (Vue) {
//     Vue.use(VueAxios, service)
//   }
// }

export {
  // installer as VueAxios,
  service as axios
}
