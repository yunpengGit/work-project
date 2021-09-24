/*
 * @Author: your name
 * @Date: 2020-10-19 22:05:42
 * @LastEditTime: 2020-10-21 11:11:56
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\api\tripRecord\detail.js
 */
import service from '../request'

// 行程详情
export function getOrderlistByTicketNo (params) {
  return service({
    url: '/api/wsExpense/getOrderlistByTicketNo',
    method: 'get',
    params
  })
}
// 行程详情
export function getJourney (params) {
  return service({
    url: '/api/wsJourney/getJourney',
    method: 'get',
    params
  })
}
// 行程订单列表
export function getList (params) {
  return service({
    url: '/api/wsOrderlist/getList',
    method: 'get',
    params
  })
}
