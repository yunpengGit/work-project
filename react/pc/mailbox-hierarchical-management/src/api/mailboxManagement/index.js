/*
 * @Author: your name
 * @Date: 2020-11-06 16:31:30
 * @LastEditTime: 2020-11-10 10:00:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import service from './../request'

// 组织结构树
export function orgList (params) {
  return service({
    url: `/api/org/${params.id}/orgList`,
    method: 'get',
  })
}
// 通过节点查询当前节点下所有邮箱信息
export function selectEmailByParam (params) {
  return service({
    url: '/api/email/selectEmailByParam',
    method: 'get',
    params
  })
}

// 单导公司查询接口
export function selectMonoderivativeBase (params) {
  return service({
    url: '/api/email/selectMonoderivativeBase',
    method: 'get',
    params
  })
}

// 单导提交接口
export function saveMailMonoderivative (params) {
  return service({
    url: '/api/email/saveMailMonoderivative',
    method: 'post',
    data: params
  })
}
