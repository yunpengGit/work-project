/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-08-06 15:37:58
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-21 21:33:34
 */
// 获取任务列表
export const getTask = {
  url: '/attendeeManage/task/list/organized',
  method: 'GET'
}
// 获取任务详情
export const getTaskDetail = {
  url: '/attendeeManage/task/details',
  method: 'GET'
  // qs: true
}
// 修改任务审核状态
export const setExamine = {
  url: '/attendeeManage/signAuditAttendee',
  method: 'POST',
  emulateJSON: true
}
// 忽略任务
export const ignoreTask = {
  url: '/attendeeManage/task/updateForSynergy',
  method: 'POST',
  emulateJSON: true
}
// 根据PC获取接站用车任务
export const getArriveCarTaskPc = {
  url: 'synergy/vehicle/task/list',
  method: 'GET'
  // emulateJSON: true
}
// 查询车辆 - 此处不需要使用接站/送站/会议三个接口 使用这一个即可
export const getCars = {
  url: '/synergy/vehicle/task/vehicle/list',
  method: 'GET'
}
// 获取接站用车任务
// export const getArriveCarTask = {
//   url: '/synergy/vehicle/task/vehicle/task/arrive/vehicle/list',
//   method: 'POST',
//   emulateJSON: true
// }
// // 获取送站空闲车辆
// export const getReturnCarTask = {
//   url: '/synergy/vehicle/task/vehicle/task/return/vehicle/list',
//   method: 'POST',
//   emulateJSON: true
// }
// 为用车人员分配车辆
export const setvehicle = {
  url: '/synergy/vehicle/task/insert',
  method: 'POST',
  emulateJSON: true
}
// 为用车人员分配车辆 - PC接口
export const setvehiclePC = {
  url: '/synergy/vehicle/task/insert',
  method: 'POST',
  emulateJSON: true
}
// 为用车人员分配车辆 - PC接口 对应用车任务管理
export const setvehiclePCTask = {
  url: '/synergy/vehicle/task/attendee/insert',
  method: 'POST',
  emulateJSON: true
}

// 待办详情
export const getTaskDetailItem = {
  url: '/conference/details',
  method: 'GET'
}
// 查看证件列表
export const getCardList = {
  url: '/synergy/card/list',
  method: 'POST',
  emulateJSON: true
}
// 获取司机 - PC
export const getDrivers = {
  url: '/synergy/driver/listNotInTask',
  method: 'GET'
}
