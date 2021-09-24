import axios from 'axios'
import qs from 'qs'
// import { Toast } from ''

// 此插件是为了解决低版本浏览器，Promise对象的finally方法不兼容问题
// require('promise.prototype.finally').shim()

// const baseURL = `/host-dirName/`;
const ServerAddress = '/server_img'
// axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 5000

axios.interceptors.request.use(
  config => {
    try {
      if (config.method.toUpperCase() === 'POST') {
        config.headers['Content-Type'] = 'application/json'
        config.headers.Accept = 'application/json'
      } else if (config.method.toUpperCase() === 'GET') {
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
    const { method, data } = request
    const params = ['get', 'delete', 'head'].indexOf(method) > -1 ? { params: data } : { data: data }
    const headers = { 'App-Token': 'b4baac0a-5f14-42c0-a984-0abcaa3dbf5b' }
    axios({ ...request, ...params, headers }).then(
      response => {
        resolve(response.data)
      },
      err => {
        if (err.message.indexOf('timeout') === 0) {
          // Toast.error('请求超时，请重试')
        }
        reject(err)
      })
  })
}

export {
  http,
  ServerAddress
}
