/*
 * @Description:
 * @Author: peng
 * @Date: 2021-04-13 11:41:42
 * @LastEditors: peng
 * @LastEditTime: 2021-08-25 14:33:37
 */
// 常用业务
export const appList = {
  // baseURL: '/mock',
  url: '/portal/app/list',
  method: 'GET'
}
export const rankAppAndResource = {
  // baseURL: '/mock',
  timeout: '10000',
  url: '/portal/app/rankAppAndResource',
  method: 'POST'
}

// 图标管理
export const appIconList = {
  // baseURL: '/mock',
  url: '/portal/appIcon/list',
  method: 'GET'
}
export const appIconSaveIcon = {
  // baseURL: '/mock',
  url: '/portal/appIcon/saveIcon',
  method: 'POST'
}
export const appIconDelete = {
  // baseURL: '/mock',
  url: '/portal/appIcon/:ids',
  method: 'DELETE'
}
