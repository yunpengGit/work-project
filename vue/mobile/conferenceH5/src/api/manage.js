/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:57:56
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-25 10:11:21
 */
// 获取用车管理列表
export const getUseCarList = {
  url: '/synergy/vehicle/task/list',
  method: 'GET'
}
// 获取当前会议下的所有车型
export const getModel = {
  url: '/synergy/common/enum/vehicle/type',
  method: 'GET'
}
// 用车详情
export const getUserCarDetail = {
  url: 'synergy/vehicle/task/detail',
  method: 'GET'
}
// 获取住宿管理列表
export const getStayList = {
  url: '/synergy/room/task/list',
  method: 'GET'
}
// 查询该场会议下房间类型
export const getRoomType = {
  url: '/synergy/common/enum/room/form',
  method: 'GET'
}
// 查询床位数
export const getRoomBedCount = {
  url: '/synergy/common/enum/room/capacity',
  method: 'GET'
}
// 查询酒店入住人员
export const getRoomPersons = {
  url: '/synergy/room/task/attendee',
  method: 'GET'
}
// 获取职务类型
export const getJob = {
  url: '/synergy/common/enum/attendee/position',
  method: 'GET'
}
// 查看会议可用司机列表
export const getDriversList = {
  url: '/synergy/driver/list',
  method: 'GET'
}
// 通过id查看司机详情
export const getDriverDetail = {
  url: '/synergy/driver/details',
  method: 'GET'
}
// 查看会议可用车辆列表
export const getCarsList = {
  url: '/synergy/vehicle/listNotInTask',
  method: 'GET'
}
// 查看会议可用车辆的颜色
export const getCarsColor = {
  url: '/synergy/common/enum/vehicle/color',
  method: 'GET'
}
// 查看会议可用车辆的座位
export const getCarsSeat = {
  url: '/synergy/common/enum/vehicle/seatNum',
  method: 'GET'
}
// 查看会议可用车辆的详情
export const getCarsDetail = {
  url: '/synergy/vehicle/details',
  method: 'GET'
}
// 查看会议用车已分配人员
export const getUseCarsStaff = {
  url: '/synergy/vehicle/task/attendee/list',
  method: 'GET'
}
// 查看会议用餐列表
export const getMealList = {
  url: '/synergy/dining/task/list',
  method: 'GET'
}
// 查看会议用餐
export const getMeal = {
  url: '/synergy/dining/typeCodeList',
  method: 'GET'
}
// 查看用餐详情
export const getMealDetail = {
  url: '/synergy/dining/task/details',
  method: 'GET'
}
// 查看用餐人员
export const getMealStaff = {
  url: '/synergy/dining/task/attendee/list',
  method: 'GET'
}
// 查看证件列表
export const getCardList = {
  url: '/synergy/card/list',
  method: 'GET'
}
// 人员证件分配列表
export const getCardPersonList = {
  url: '/synergy/card/attendee/getCardAttendeeList',
  method: 'GET'
}
// 人员证件分配列表
export const getCardCarsList = {
  url: '/synergy/card/vehicle/getCardVehicleList',
  method: 'GET'
}
// 人员证件分配列表 - 获取车辆颜色
export const getCardCarsColor = {
  url: '/synergy/common/enum/card/color',
  method: 'GET'
}
// 人员证件分配列表 - 获取车辆座位
export const getCardCarsSeat = {
  url: '/synergy/common/enum/card/seatNum',
  method: 'GET'
}
// 查询会议议程列表信息
export const getAgendaList = {
  url: '/conferenceAgenda/list/:conferenceId',
  method: 'GET'
}
// 查询会议议程时间列表 - 先获取时间列表 再获取去议程列表
export const getAgendaTime = {
  url: '/conferenceAgenda/queryTimeList/:conferenceId',
  method: 'GET'
}
// 根据议程查询签到人数列表
export const getAgendaPersons = {
  url: '/attendeeManage/list/organized',
  method: 'GET'
}
// 取消议程签到
export const cancelSignIn = {
  url: '/attendeeManage/agendaCancel/ByOrganized',
  method: 'POST',
  emulateJSON: true
}
// 议程签到
export const signIn = {
  url: '/attendeeManage/agendaSignIn/ByOrganized',
  method: 'POST',
  emulateJSON: true
}
// 会议报到
export const checkIn = {
  url: '/attendeeManage/checkIn/ByOrganized',
  method: 'POST',
  emulateJSON: true
}
// 取消报到
export const cancelCheckIn = {
  url: '/attendeeManage/cancel/checkIn/ByOrganized',
  method: 'POST',
  emulateJSON: true
}
// 获取汽车公司列表
export const getCarsCompany = {
  url: '/synergy/vehicleCompany/list',
  method: 'GET'
}
// 添加司机
export const addDriver = {
  url: '/synergy/driver/insert',
  method: 'POST',
  emulateJSON: true
}
// 修改司机
export const editDriver = {
  url: '/synergy/driver/update',
  method: 'POST',
  emulateJSON: true
}
// 删除司机
export const deleteDriver = {
  url: '/synergy/driver/delete',
  method: 'POST'
  // emulateJSON: true
}

// 人员分配房间
export const allotRoom = {
  url: '/synergy/room/task/insert',
  method: 'POST',
  emulateJSON: true
}

// 添加用证人员
export const addCardPerson = {
  url: '/synergy/card/attendee/insertList',
  method: 'POST',
  emulateJSON: true
}

// 修改证件状态
export const changeCardStatus = {
  url: '/synergy/card/attendee/updateCardStatusAttendee',
  method: 'POST',
  emulateJSON: true
}

// 修改车辆证件状态
export const changeCarStatus = {
  url: '/synergy/card/vehicle/updateCardStatusVehicle',
  method: 'POST',
  emulateJSON: true
}

// 获取签到/报到统计信息
export const getSignCount = {
  url: '/attendeeManage/list/organized/signedStatistics',
  method: 'GET'
}

// 移除房间住宿人员
export const removeRoomPerson = {
  url: '/synergy/room/task/delete',
  method: 'POST',
  emulateJSON: true
}

// 获取上车地点/下车地点
export const getPlace = {
  url: '/synergy/vehicle/task/address/list',
  method: 'GET'
}
