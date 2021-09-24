/* eslint-disable yoda, no-const-assign */
import loader from '../loader'
import axios from 'axios'
import merge from 'webpack-merge'
import Qs from 'qs'
import { compile, parse } from '../path'
class ApiManage {
  constructor (options) {
    this.axios = axios.create()
    this.options = options || {}
  }

  request (key, params = {}) {
    const { api, config } = loader(key)
    // 合并策略  全局配置=>模块配置=>单独配置
    let options = merge({}, this.options, config, api)
    const isGet =
      typeof options.method === 'undefined' ||
      'post,put,patch,delete'.indexOf(options.method.toLowerCase()) === -1
    if ('function' === typeof params) {
      options = params(options)
    } else {
      var parsedURL = parse(options.url)
      try {
        if (
          Object.prototype.toString.call(params) === '[object Object]' &&
          parsedURL.length > 1
        ) {
          params = merge({}, params)
          const toPath = compile(options.url, {
            encode: encodeURIComponent
          })
          let url = ''
          if (toPath(params).indexOf('&')) {
            url = toPath(params).replace('&', '?')
          } else {
            url = toPath(params)
          }
          options.url = url
          parsedURL.forEach(v => {
            v && v.name && delete params[v.name]
          })
        }
      } catch (e) {
        throw new Error(e)
      }
      if (isGet) {
        // IE下存在缓存相同GET请求的行为
        options.params = merge(
          options.cache === false &&
            (!!window.ActiveXObject || 'ActiveXObject' in window)
            ? {
              _t: +new Date()
            }
            : {},
          options.params,
          params
        )
      } else {
        if (parsedURL.length > 1) {
          params = merge(options.params, params)
        }
        if (options.isString) {
          // 参数为json字符串的传参方式
          options.headers = {
            'Content-Type': 'application/json; charset=utf-8'
          }
          params = JSON.stringify(params)
        } else if (options.emulateJSON === true) {
          // 模拟表单格式发送数据
          options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
          params = Qs.stringify(params)
        }
        options.data = JSON.stringify(params) !== '{}' ? params : null
      }
      // 本地联调 占旭本地
      // options.headers = {
      //   ...options.headers,
      //   'Authorization': 'Bearer 9e77b31b-440b-4c9d-a75a-55f41688a6b1'
      // }
    }

    const _axios = this.axios

    return new Promise(function (resolve, reject) {
      // 临时处理get请求时，数组类型如arr=[1,2]，则转换成arr=1&arr=2
      if (options.method === 'get' || options.method === 'GET' || (options.method === 'PUT' && options.strPut)) {
        let params = ''
        params = Qs.stringify(options.params, {
          arrayFormat: 'repeat'
        })
        options.params = ''
        options.url = `${options.url}?${params}`
      }

      _axios
        .request(options)
        .then(function (response) {
          resolve(response)
        })
        .catch(function (err) {
          reject(err)
        })
    })
  }

  use (interceptors) {
    ['request', 'response'].forEach(v => {
      const fns = interceptors[v]
      const interceptor = this.axios.interceptors[v]
      fns && fns.length && interceptor.use.apply(interceptor, fns)
    })
  }
}

ApiManage.install = function (Vue) {
  Vue.prototype.$api = Vue.api = function () {
    const Instance = this.$root.$options.api
    return Instance.request.apply(Instance, arguments)
  }
  Vue.prototype.$axios = Vue.axios = this.axios
}

export default ApiManage
