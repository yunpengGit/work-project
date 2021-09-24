/*
 * @Author: your name
 * @Date: 2020-10-16 11:37:37
 * @LastEditTime: 2020-10-21 15:07:07
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\api\tripRecord\sendEmail.js
 */
import service from '../request'

// 行程确认函发送到邮箱
export function sendEmail (params) {
  return service({
    url: '/api/wsJourney/sendEmail',
    method: 'get',
    params
  })
}
// 确认函发送到邮箱
export function batchConfirmationForMobilePhone (params) {
  return service({
    url: '/api/wsJourney/batchConfirmationForMobilePhone',
    method: 'get',
    params
  })
}
