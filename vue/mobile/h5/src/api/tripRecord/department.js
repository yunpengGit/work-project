/*
 * @Author: your name
 * @Date: 2020-10-16 11:37:37
 * @LastEditTime: 2020-10-19 18:53:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\api\tripRecord\index.js
 */
import service from '../request'

// 部门列表
export function getDeptPage (params) {
  return service({
    url: '/api/wsCategory/getDeptPage',
    method: 'get',
    params
  })
}
// 人员列表
export function getPersonPage (params) {
  return service({
    url: '/api/wsDept/getPersonPage',
    method: 'get',
    params
  })
}
