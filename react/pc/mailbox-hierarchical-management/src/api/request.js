/*
 * @Author: your name
 * @Date: 2020-11-04 16:35:41
 * @LastEditTime: 2021-06-25 15:43:56
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\api\request.js
 */
import axios from 'axios'
import { message, Space } from 'antd';
import {localStorageGet} from './../utils/localStorageFn'
// 创建 axios 实例
// * 使用axios.create请求时需要注意：get，post传参方式
// * get: params
// * post: data
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 10000
})

const err = (error) => {
	const status = error.status;
	switch (status) {
		/* eslint-disable no-param-reassign */
		case 400: error.response.data.message = '请求错误'; break;
		case 401: error.response.data.message = '未授权，请登录'; break;
		case 403: error.response.data.message = '拒绝访问'; break;
		case 404: error.response.data.message = `请求地址出错: ${error.response.config.url}`; break;
		case 408: error.response.data.message = '请求超时'; break;
		case 500: error.response.data.message = '服务器内部错误'; break;
		case 501: error.response.data.message = '服务未实现'; break;
		case 502: error.response.data.message = '网关错误'; break;
		case 503: error.response.data.message = '服务不可用'; break;
		case 504: error.response.data.message = '网关超时'; break;
		case 505: error.response.data.message = 'HTTP版本不受支持'; break;
		default: break;
		/* eslint-disabled */
	}
  if (error.response) {
		// console.log(error.response)
    message.error(error.response.data.message);
    // message.warning('This is a warning message');
  }
  return Promise.reject(error)
}

service.interceptors.request.use((config) => {
  let token = ''
  if (localStorageGet("loginInfo")) {
    token = JSON.parse(localStorageGet("loginInfo")).token
		config.headers['Authorization'] = token
  }
  return config
}, err)

service.interceptors.response.use((response) => {
	if(!response.data.data){
		// 处理下载文件
		return response
	}
	// if (response.data.success) {
	// 	return response.data
  // } else if (response.data.status.statusCode)
  if (response.data.success||(response.data.status&&response.data.status.statusCode&&response.data.status.statusCode == '100')) {
		return response.data
  } else {
		if (response.data.success) {
			message.error(response.data.message);
		} else if (response.data.statusCode != '100'&&response.data.status.statusMsg) {
			message.error(response.data.status.statusMsg);
		}
		return response.data
	}
}, err)

export default service
