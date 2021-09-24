/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 14:02:32
 * @LastEditors: peng
 * @LastEditTime: 2021-08-10 14:44:09
 */
/**
 * @name:login
 * @msg:登录接口
 * @param {*}
 * @return {*}
 */
export const login = {
  url: '/auth/external/login',
  method: 'POST'
}
/**
 * @name:devLogin
 * @msg:测试环境登录接口
 * @param {*}
 * @return {*}
 */
export const devLogin = {
  url: '/auth/login',
  method: 'POST'
}
/**
 * @name:getInfo
 * @msg:获取用户信息接口
 * @param {*}
 * @return {*}
 */
export const getInfo = {
  url: '/system/user/getInfo',
  method: 'GET'
}

/**
 * @name:logout
 * @msg:登出接口
 * @param {*}
 * @return {*}
 */
export const logout = {
  emulateJSON: false,
  url: '/auth/external/logout',
  // method: 'DELETE'
  method: 'POST'
}
/**
 * @name: orgTopTree
 * @msg:在线人员信息
 * @param {*}
 * @return {*}
 */
export const orgTopTree = {
  url: '/portal/addrbook/onlineUser/getOnlineUserCount',
  method: 'GET'
}

// 获取集团总部信息
export const avicGroupInfo = {
  // baseURL: '/mock',
  url: '/system/dept/avicGroup/info',
  method: 'GET'
}

/**
 * @name:
 * @msg: sys_job_group
 * @param {*}
 * @return {*}
 */
export const sys_job_group = {
  url: '/system/dict/data/type/sys_job_group',
  method: 'GET'
}
/**
 * @name:
 * @msg:sys_job_status
 * @param {*}
 * @return {*}
 */
export const sys_job_status = {
  url: '/system/dict/data/type/sys_job_status',
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
