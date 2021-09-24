/*
 * @Author: your name
 * @Date: 2020-11-24 16:04:10
 * @LastEditTime: 2020-11-24 16:05:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\api\auditManagement\administratorOperationLogs.js
 */
import service from './../request'

// 组织结构树
export function selectOperationLogByParam (params) {
  return service({
    url: '/api/log/selectOperationLogByParam',
		method: 'get',
		params
  })
}
