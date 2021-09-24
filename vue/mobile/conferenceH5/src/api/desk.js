/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-30 17:18:24
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-07-28 00:59:38
 */
// 获取当前会务组菜单权限
export const getMenuList = {
  url: '/menu/getConferenceGroupUserMenuList',
  method: 'GET'
}
// 获取统计数据
export const getStat = {
  url: '/conferenceStatistics/statistics',
  method: 'GET'
}
// 获取会议详情
export const getDetail = {
  url: '/conference/details',
  method: 'GET'
}
// 获取议程详情
export const getAgenda = {
  url: '/conferenceAgenda/findByConferenceId',
  method: 'GET'
}
// 获取嘉宾
export const getGuest = {
  url: '/conferenceGuest/findByConferenceId',
  method: 'GET'
}
// 会议资料
export const getMaterial = {
  url: '/conferenceMaterialsGroup/findByConferenceId',
  method: 'GET'
}
// 获取报名管理列表
export const getEnrollManage = {
  url: '/attendeeManage/list/organized',
  method: 'GET'
}
// 通过会议id查看当前登录用户的参会人详情
export const getAttendeeFromMeetingId = {
  url: '/attendeeManage/details/byConferenceId',
  method: 'GET'
}
// 查看参会人信息
export const getAttendee = {
  url: '/attendeeManage/details',
  method: 'GET'
}
// 获取陪同人员列表
export const getAccompany = {
  url: '/conferenceAccompany/honour/list/byAttendeeId',
  method: 'GET'
}
// 获取我的关注列表
export const getAttent = {
  url: '/conferenceGroupUser/attention/list',
  method: 'GET'
}
// 获取我的未关注列表
export const getAttentNo = {
  url: '/conferenceGroupUser/attention/list/noAttention',
  method: 'GET'
}
// 添加我的关注
export const addAttent = {
  url: '/conferenceGroupUser/attention/insert',
  method: 'POST',
  emulateJSON: true
}

// 取消我的关注
export const deleteAttent = {
  url: '/conferenceGroupUser/attention/delete',
  method: 'POST',
  emulateJSON: true
}

// 会务组通讯录
export const getMeetingGroupPhone = {
  url: '/conferenceGroupUser/queryUsersByConferenceId',
  method: 'GET'
}

// 合作方通讯录
export const getPartnerPhone = {
  url: '/synergy/common/querycontactinfo',
  method: 'GET'
}

// 查询用餐类型
export const getMealType = {
  url: '/synergy/dining/typeCodeList',
  method: 'GET'
}
// 查询餐厅列表
export const getRestaurantList = {
  url: '/synergy/dining/list',
  method: 'GET'
}
// 添加用餐任务
export const addMeal = {
  url: '/synergy/dining/task/insert',
  method: 'POST',
  emulateJSON: true
}
// 取消用餐任务
export const deleteMeal = {
  url: '/synergy/dining/task/cancel',
  method: 'POST',
  emulateJSON: true
}
// 获取餐厅信息
export const getRestaurantDetail = {
  url: '/synergy/dining/details',
  method: 'GET'
}
// 新增用餐人员
export const addMealUsers = {
  url: '/synergy/dining/task/attendee/insert',
  method: 'POST',
  emulateJSON: true
}
// 修改用餐人员
export const editMealUsers = {
  url: '/synergy/dining/task/attendee/update',
  method: 'POST',
  emulateJSON: true
}
// 修改用餐人员
export const deleteMealUsers = {
  url: '/synergy/dining/task/attendee/delete',
  method: 'POST',
  emulateJSON: true
}
// 添加用车任务
export const addUserCar = {
  url: '/synergy/vehicle/task/insert',
  method: 'POST',
  emulateJSON: true
}
// 编辑用车任务
export const editUserCar = {
  url: '/synergy/vehicle/task/update',
  method: 'POST',
  emulateJSON: true
}
// 添加用车人
export const addCarUser = {
  url: '/synergy/vehicle/task/attendee/insert',
  method: 'POST',
  emulateJSON: true
}
// 取消用车任务
export const deleteUserCar = {
  url: '/synergy/vehicle/task/cancel',
  method: 'POST',
  emulateJSON: true
}
// 删除用车人
export const deleteCarUser = {
  url: '/synergy/vehicle/task/attendee/delete',
  method: 'POST',
  emulateJSON: true
}
// 获取车型
export const getCarType = {
  url: '/synergy/vehicleType/list',
  method: 'GET'
}
// 添加车辆
export const addCar = {
  url: '/synergy/vehicle/insert',
  method: 'POST',
  emulateJSON: true
}
// 编辑车辆
export const editCar = {
  url: '/synergy/vehicle/update',
  method: 'POST',
  emulateJSON: true
}
// 删除车辆
export const deleteCar = {
  url: '/synergy/vehicle/delete',
  method: 'POST',
  emulateJSON: true
}

