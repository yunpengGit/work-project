/*
 * @Author: your name
 * @Date: 2020-12-14 13:35:05
 * @LastEditTime: 2021-01-06 13:04:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\auditManagement\sevice.js
 */
import service from '../../api/request'

// 管理员操作日志查询
export function selectOperationLogByParam (params) {
  return service({
    url: '/api/log/selectOperationLogByParam',
		method: 'get',
		params
  })
}
// 阿里邮箱登录日志查询接口
export function selectAliMailLogInfoByParam (params) {
  return service({
    url: '/api/email/selectAliMailLogInfoByParam',
		method: 'post',
		data: params
  })
}
// 阿里邮箱收、发、删信日志查询接口
export function selectAliMailLogByParam (params) {
  return service({
    url: '/api/email/selectAliMailLogByParam',
		method: 'post',
		data: params
  })
}
