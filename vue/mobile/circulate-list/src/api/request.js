import Vue from 'vue';
import axios from 'axios';
import { Toast } from 'vant';

Vue.use(Toast);

// 创建 axios 实例
// * 使用axios.create请求时需要注意：get，post传参方式
// * get: params
// * post: data
// console.log(process.env.NODE_ENV);
// debugger;
let baseURL = '/';
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://jsezxg.natappfree.cc';
}

const service = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
  baseURL,
  timeout: 6000,
});

const err = (error) => {
  if (error.response) {
    const { data } = error.response;
    if (error.response.status === 403) {
      Toast.fail(data.message);
    }
    if (error.response.status === 401) {
      Toast.fail(data.message);
    }
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use((config) => config, err);

// response interceptor
service.interceptors.response.use((response) => response.data, err);

export default service;
