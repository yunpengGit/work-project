/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 14:45:32
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-07-03 22:15:06
 */
// 查询参会人的专车安排 列表
export const getSpecialCarList = {
  url: '/synergy/vehicle/task/special/attendee/vehicle',
  method: 'GET'
}
// 查询参会人的用车任务 列表
export const getCarList = {
  url: '/synergy/vehicle/task/attendee/vehicle',
  method: 'GET'
}
// 专车详情
export const getSpecialCar = {
  url: '/synergy/vehicle/task/special/attendee/list',
  method: 'GET'
}
// 接站送站详情
export const getCar = {
  url: '/synergy/vehicle/task/attendee/list',
  method: 'GET'
}
// 住宿安排列表
export const getStayList = {
  url: '/synergy/room/task/attendee/room',
  method: 'GET'
}
// 用餐安排列表
export const getMealList = {
  url: '/synergy/dining/task/attendee/dinner',
  method: 'GET'
}
// 票证安排列表
export const getCardList = {
  url: '/synergy/card/attendee/card',
  method: 'GET'
}
// 嘉宾证更新
export const updateGuesCard = {
  url: '/synergy/card/attendee/update',
  method: 'post',
  emulateJSON: true
}
// 车证更新
export const updatecarLicense = {
  url: '/synergy/card/attendee/update',
  method: 'post',
  emulateJSON: true
}
