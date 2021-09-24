/*
 * @Author: pengpeng
 * @Date: 2020-10-14 09:17:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-20 10:23:42
 * @Description: file content
 */
import axios from 'axios'
import { Notify } from 'vant'

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
    Notify('responseStatus:' + error.response.status)
  }
  return Promise.reject(error)
}

service.interceptors.request.use((config) => {
  return config
}, err)

service.interceptors.response.use((response) => {
  if ((response.page && response.page.state !== 1) || (response.CommonModel && response.CommonModel.state !== 1) || (response.journeyModel && response.journeyModel.state !== 1)) {
    Notify({ type: 'danger', message: response.page.resultMsg })
  }
  return response.data
}, err)

export default service
