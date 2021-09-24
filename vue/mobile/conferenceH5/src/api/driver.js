/*
 * @Description:
 * @Author: peng
 * @Date: 2021-07-08 10:17:52
 * @LastEditors: peng
 * @LastEditTime: 2021-07-09 14:06:34
 */

export const list = {
  url: '/synergy/driver/app/list',
  method: 'GET'
}

export const getVechicleTaskDate = {
  url: '/synergy/driver/app/getVechicleTaskDate',
  method: 'GET'
}
export const taskDetails = {
  url: '/synergy/driver/app/taskDetails',
  method: 'GET'
}
// 更新任务状态
export const updateTaskStatus = {
  url: '/synergy/driver/app/updateTaskStatus',
  method: 'GET'
}
// 航班信息
export const getFlightNews = {
  url: '/etrip/getFlightNews',
  method: 'GET'
}
// 通过userId 获取 driverId
export const getDriverIdByUserId = {
  url: '/synergy/driver/app/getDriverIdByUserId',
  method: 'GET'
}
