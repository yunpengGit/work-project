import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant'

// 此插件是为了解决低版本浏览器，Promise对象的finally方法不兼容问题
require('promise.prototype.finally').shim()

// const baseURL = `/host-dirName/`;
const ServerAddress = '/server_img'
// axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 5000

axios.interceptors.request.use(
  config => {
    try {
      config.data.token = localStorage.getItem('token')
      config.data.obtUserName = localStorage.getItem('obtUserName')
      if (config.method.toUpperCase() === 'POST') {
        config.data = qs.stringify(config.data)
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
    } catch (e) {
      console.error(e)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

const http = (request) => {
  return new Promise((resolve, reject) => {
    let { method, data } = request
    let params = ['get', 'delete', 'head'].indexOf(method) > -1 ? { params: data } : { data: data }
    axios({ ...request, ...params }).then(
      response => {
        resolve(response.data)
      },
      err => {
        if (err.message.indexOf('timeout') === 0) {
          Toast.error('请求超时，请重试')
        }
        reject(err)
      })
  })
}

export {
  http,
  ServerAddress
}
