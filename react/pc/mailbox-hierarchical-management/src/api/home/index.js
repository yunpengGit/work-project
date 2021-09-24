/*
 * @Author: your name
 * @Date: 2020-11-09 10:01:19
 * @LastEditTime: 2020-11-09 11:08:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\api\home\index.js
 */
import service from './../request'

// 组织结构树
export function login (params) {
  return service({
    url: '/api/login',
    method: 'post',
    data: params
  })
}