/*
 * @Author: your name
 * @Date: 2020-10-16 11:37:37
 * @LastEditTime: 2020-10-21 15:04:58
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\api\tripRecord\index.js
 */
import service from '../request'

// 行程记录列表
export function getList (params) {
  return service({
    url: '/api/wsJourney/getList',
    method: 'get',
    params
  })
}
// 行程确认
export function confirmJourney (params) {
  return service({
    url: '/api/wsJourney/confirmJourney',
    method: 'get',
    params
  })
}
// 行程确认
export function confirmJourneyQX (params) {
  return service({
    url: '/api/wsJourney/confirmJourneyQX',
    method: 'get',
    params
  })
}
// 批量确认行程
export function batchConfirmJourney (params) {
  return service({
    url: '/api/wsJourney/batchConfirmJourney',
    method: 'get',
    params
  })
}
// 批量取消确认行程
export function batchConfirmJourneyQX (params) {
  return service({
    url: '/api/wsJourney/batchConfirmJourneyQX',
    method: 'get',
    params
  })
}
