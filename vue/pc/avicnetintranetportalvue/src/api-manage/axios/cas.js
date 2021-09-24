/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-19 11:14:39
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-29 14:49:50
 */
// import store from '@/store'
import { getToken } from '@/utils/auth'
import ElementUI from '@avic/golden-pc-ui'
const token = getToken()
// if (process.env.NODE_ENV === 'development') {
//   token = '0488d5e6-8b6d-4388-a6c4-d2162dec85d3'
// } else {
//   token = getToken()
// }
export default {
  response: [
    function (response) {
      const res = response.data
      if (res.code === 401) {
        if (process.env.NODE_ENV === 'development') {
          ElementUI.Message({
            type: 'error',
            message: res.msg
          })
          return
        }
        const loc = window.location.href
        const url = loc.split('?ticket')[0]
        window.location.href =
        res.data.loginUrl +
        encodeURIComponent(url)
        return Promise.reject(response)
      }
      return response
    },
    function (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            window.location.href = error.response.data.error.loginPage
            // 返回 401 清除token信息并跳转到登录页面
        }
      }
      return Promise.reject(error.response.data) // 返回接口返回的错误信息
    }
  ],
  request: [
    function (config) {
      config.headers.common['X-Requested-With'] = 'XMLHttpRequest'
      config.headers['Authorization'] = `Bearer ${token}`
      config.withCredentials = config.withCredentials !== undefined ? config.withCredentials : true
      return config
    }
  ]
}
