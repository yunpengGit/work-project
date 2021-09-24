import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 10000

axios.interceptors.request.use(
  config => {
    try {
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
          console.error('请求超时，请重试')
        }
        reject(err)
      })
  })
}

export {
  http
}
