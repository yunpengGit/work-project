/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-15 20:15:25
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-16 16:04:17
 */
// 获取审核列表
export const getMsgList = {
  url: '/msglog/manually/list',
  method: 'POST',
  emulateJSON: true
}
// 修改审核状态
export const setMsgStatus = {
  url: '/msglog/manually/verify',
  method: 'POST',
  emulateJSON: true
}
// 获取审核详情列表
export const getMsgDetailList = {
  url: '/msglog/list',
  method: 'GET'
}
// 获取推送内容
export const getPushData = {
  url: '/msgtemplate/list',
  method: 'GET'
}
// 发送消息
export const sendMsg = {
  url: '/msglog/manually/send',
  method: 'POST',
  emulateJSON: true
}
// 获取审核任务数量
export const getAuditCounts = {
  url: '/auditTask/counts',
  method: 'GET'
}
// 获取审核任务关联业务数据
export const getAuditList = {
  url: '/auditTask/businessList',
  method: 'POST',
  emulateJSON: true
}
// 审核任务
export const setAudit = {
  url: '/auditTask/audit',
  method: 'POST',
  emulateJSON: true
}
// 用车任务查询人员
export const getVehicleAttendees = {
  url: '/synergy/vehicle/task/attendee/list',
  method: 'GET'
}
// 用餐任务查询人员
export const getDiningAttendees = {
  url: '/synergy/dining/task/attendee/list',
  method: 'GET'
}
// 住宿任务查询人员
export const getRoomAttendees = {
  url: '/synergy/room/task/attendee',
  method: 'GET'
}

// 住宿任务查询是否存在
export const showTaskIsExist = {
  url: '/synergy/room/task/showTaskIsExist',
  method: 'GET'
}
