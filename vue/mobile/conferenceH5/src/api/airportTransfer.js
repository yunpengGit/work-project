/*
 * @Description:
 * @Author: caofeng
 * @Date: 2021-07-08 10:17:52
 * @LastEditors: caofeng
 * @LastEditTime: 2021-07-28 15:44:24
 */

// 获取接（送）站任务日期集合
export const getVechicleTaskDate = {
  url: '/synergy/vehicle/task/getPickOnTimes/:conferenceId/:type',
  method: 'GET'
}

// 统计应接、已接、未接（应送、已送、未送）人数
export const statisticsNum = {
  url: '/synergy/vehicle/task/statisticsNumOfPeople',
  method: 'POST',
  emulateJSON: true
}

// 任务列表
export const list = {
  url: '/synergy/vehicle/task/vehicleTaskList',
  method: 'GET'
}

// 人员列表
export const peopleList = {
  url: '/synergy/vehicle/task/shouldBePickedUpPeople',
  method: 'POST',
  emulateJSON: true
}

// 更新任务状态
export const updateStatus = {
  url: '/synergy/vehicle/task/pickOnAttendee',
  method: 'POST',
  emulateJSON: true
}

// 航班信息
export const getFlightNews = {
  url: '/etrip/getFlightNews',
  method: 'GET'
}

// 更新任务
export const updateTask = {
  url: '/attendeeManage/updateFlightInfo',
  method: 'POST',
  emulateJSON: true
}
