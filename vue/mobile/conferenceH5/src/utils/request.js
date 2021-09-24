/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-10 03:32:54
 */
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { Toast } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
import { compile } from './compile'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 根据模块化的内容判断HTTP请求类型及相关设置
    const options = compile(config.url).options
    const jsonHeaders = 'application/json;charset=UTF-8'
    const enctypeHeaders = 'application/x-www-form-urlencoded;charset=UTF-8'
    config.url = options.url.split('/').map(v => v.includes(':') ? config.data[v.substr(1)] : v).join('/')
    config.method = options.method
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    if (options.contentType) {
      config.headers['Content-Type'] = options.contentType
    } else {
      if (options.emulateJSON) {
        config.headers['Content-Type'] = jsonHeaders
      } else {
        config.headers['Content-Type'] = enctypeHeaders
        // 后台可能没处理 所以不需要将data序列化
        // config.data = qs.stringify(config.data)
      }
    }
    if (options.hideloading) {
      config.hideloading = options.hideloading
    }
    if (options.qs) {
      console.log(config)
      config.data = qs.stringify(config.data)
    }
    if (options.method && options.method.toUpperCase() === 'GET') {
      config.params = Object.assign({}, config.data)
      delete config.data
    }
    // 每次发送HTTP请求都需要将token带至服务器
    config.headers['authToken'] = getToken()
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        duration: 0,
        forbidClick: true
      })
    }
    if (store.getters.token) {
      config.headers['X-Token'] = ''
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    if (!response.config.hideloading) {
      Toast.clear()
    }
    const res = response.data
    if (res.code && res.code !== 2000) {
      if (res.code === 3000 && response.config.url !== '/seatingPlan/seat' && response.config.url !== '/shortMessage/verificationCode' && response.config.url !== '/attendeeManage/insert') {
        Toast(res.message)
      }
      // 登录超时,重新登录
      if (res.code === 6000) {
        location.href = `${process.env.VUE_APP_SSO_ADDRESS}/login?service=${encodeURI(window.location.href)}`
        /*
        location.href = `${process.env.VUE_APP_SSO_ADDRESS}/login?service=${encodeURI(window.location.href)}`
        if (process.env.NODE_ENV === 'production') {
          store.dispatch('Login').then(res => {
            if (res === 'no tiket') {
              location.href = `${process.env.VUE_APP_SSO_ADDRESS}/login?service=${encodeURI(window.location.href)}`
            }
          })
        }
        */
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
