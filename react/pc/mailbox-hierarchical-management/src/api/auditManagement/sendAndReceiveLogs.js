/*
 * @Author: your name
 * @Date: 2020-11-26 11:42:50
 * @LastEditTime: 2020-11-26 14:07:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\api\auditManagement\sendAndReceiveLogs.js
 */
import service from './../request'

// 组织结构树
export function selectAliMailLogByParam (params) {
  return service({
    url: '/api/email/selectAliMailLogByParam',
		method: 'get',
		params
  })
}
