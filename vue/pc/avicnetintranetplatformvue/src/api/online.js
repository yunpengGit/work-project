/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-05-11 16:22:33
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-11 16:24:35
 */
/**
 * @name: onlineList
 * @msg: 查询在线用户列表
 * @param {*}
 * @return {*}
 */
export const onlineList = {
  url: '/system/online/list',
  method: 'GET'
}
/**
 * @name:forceLogout
 * @msg:强退用户
 * @param tokenId
 * @return {*}
 */
export const forceLogout = {
  url: '/system/online',
  method: 'delete'
}
