/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-15 14:54:57
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-19 15:18:42
 */
export const login = {
  url: '/auth/external/login',
  method: 'POST'
}

export const getInfo = {
  url: '/system/user/getInfo',
  method: 'GET'
}

export const logout = {
  emulateJSON: false,
  url: '/auth/external/logout',
  // method: 'DELETE'
  method: 'POST'
}

export const devLogin = {
  url: '/auth/login',
  method: 'POST'
}

export const devLogout = {
  emulateJSON: false,
  url: '/auth/logout',
  // method: 'DELETE'
  method: 'POST'
}

export const devUserInfo = {
  url: '/system/user/getInfo',
  method: 'GET'
}

export const getCanaryFlag = {
  url: '/auth/external/getCanaryFlag',
  method: 'GET'
}
