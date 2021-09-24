/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-01 11:00:59
 * @LastEditors: peng
 * @LastEditTime: 2021-08-10 10:00:59
 */
export const demoApi = {
  baseURL: '/mock',
  url: '/portal/notice/user/list',
  method: 'GET'
}

// 获取集团总部信息
export const avicGroupInfo = {
  // baseURL: '/mock',
  url: '/system/dept/avicGroup/info',
  method: 'GET'
}

// 获取集团总部信息
export const getDeptPaths = {
  url: '/portal/mqtt/deptPaths',
  method: 'GET'
}

/**
 * @name: getMj
 * @msg: 获取MJ类型
 * @param {*}
 * @return {*}
 */
export const getMj = {
  url: '/system/dict/data/type/sys_data_secret_level',
  method: 'GET'
}

/**
 * @name: componentExec
 * @msg: 自定义组件后台请求返回数据
 * @param {*}
 * @return {*}
 */
export const componentExec = {
  url: '/portal/component/request/exec',
  method: 'POST'
}

