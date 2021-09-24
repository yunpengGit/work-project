/*
 * @Author: your name
 * @Date: 2020-10-20 16:52:28
 * @LastEditTime: 2020-10-20 17:44:14
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\api\tripRecord\costCenter.js
 */
import service from '../request'
// 获取成本中心列表
export function getCostCenterList (params) {
  return service({
    url: '/api/wsCostCenter/getCostCenterList',
    method: 'get',
    params
  })
}
// 修改成本中心字段
export function changeCost (params) {
  return service({
    url: '/api/wsJourney/changeCost',
    method: 'post',
    params
  })
}
