/*
 * @Author: your name
 * @Date: 2020-10-16 11:37:37
 * @LastEditTime: 2020-10-19 16:24:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\api\tripRecord\index.js
 */
import service from '../request'

// 行程记录列表
export function confirmationForMobilePhone (params) {
  return service({
    url: '/api/wsJourney/confirmationForMobilePhone',
    method: 'get',
    params
  })
}
