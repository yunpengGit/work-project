/*
 * @Author: pengpeng
 * @Date: 2020-10-14 09:24:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-19 13:01:09
 * @Description: file content
 */
import service from '../request'

// 获取token
export function getH5Token (params) {
  return service({
    url: '/api/wsToken/getH5Token',
    method: 'get',
    params
  })
}
// 权限接口
export function getH5Permission (params) {
  return service({
    url: '/api/ws/getH5Permission',
    method: 'get',
    params
  })
}
// 获取员工某一年的航班飞行信息
export function getOneYearFlightInfoDetail (params) {
  return service({
    url: '/api/wsJourney/getOneYearFlightInfoDetail',
    method: 'get',
    params
  })
}
// 航信
export function loginHx (params) {
  return service({
    url: '/api/wsTravelsky/loginHx',
    method: 'get',
    params
  })
}
// 航信
export function loginXc (params) {
  return service({
    url: '/api/wsCtrip/loginXc',
    method: 'get',
    params
  })
}
