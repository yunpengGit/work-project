/*
 * @Author: your name
 * @Date: 2020-10-16 11:37:37
 * @LastEditTime: 2020-10-20 10:45:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\api\tripRecord\index.js
 */
import service from '../request'

// 订单详情
export function getOrderModel (params) {
  return service({
    url: '/api/wsOrderlist/getOrderModel',
    method: 'get',
    params
  })
}
