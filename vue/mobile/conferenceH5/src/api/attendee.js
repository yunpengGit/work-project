/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-07 17:20:02
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-09 16:21:13
 */
// 根据id查看参会人信息
export const getAttendeeDetail = {
  url: '/attendeeManage/details',
  method: 'GET'
}

// 通过会议id查看当前登录用户的参会人详情
export const getAttendeeFromMeetingId = {
  url: '/attendeeManage/details/byConferenceId',
  method: 'GET'
}

// 获取议程信息
export const getAgenda = {
  url: '/conferenceAgenda/getAgendaAttendeeListByUser',
  method: 'GET'
}

// 获取活动轨迹
export const getLocus = {
  url: '/log/list/track',
  method: 'GET'
}
// 获取陪同列表
export const getAttendee = {
  url: '/conferenceAccompany/list/byAttendeeId',
  method: 'GET'
}
// 获取会议报名设置
export const getRegSettings = {
  url: '/conferenceSignConfig/getByConferenceId',
  method: 'GET'
}
// 获取会议详情
export const getDetail = {
  url: '/conference/details',
  method: 'GET'
}
// // 标签获取
// export const getLabel = {
//   url: '/conferenceTag/getList',
//   method: 'GET'
// }
// // 获取性别
// export const getSex = {
//   url: '/dictionary/sex/dictionaryValue',
//   method: 'GET'
// }
// // 获取职位级别
// export const getLevel = {
//   url: '/dictionary/positionLevel/dictionaryValue',
//   method: 'GET'
// }
// // 获取证件类型
// export const getCardType = {
//   url: '/dictionary/cardType/dictionaryValue',
//   method: 'GET'
// }
// // 获取民族
// export const getNation = {
//   url: '/dictionary/nation/dictionaryValue',
//   method: 'GET'
// }
// 通过姓名和手机获取已存在的草稿
export const isSignUp = {
  url: '/attendeeManage/getDraft',
  method: 'GET'
}
// 根据手机号码和手机号码获取用户信息
export const getUserInfo = {
  url: '/user/getUserByUserNameAndMobile',
  method: 'GET'
}
// 暂存
export const addInsert = {
  url: '/attendeeManage/insert',
  method: 'POST',
  emulateJSON: true
}
// 通过会议ID和userId校验报名设置
export const authAttendee = {
  url: '/attendeeManage/vertify/byConferenceId',
  method: 'GET'
}
// 参会人获取报名表单项
export const getForms = {
  url: '/attendeeManage/getSignForm',
  method: 'GET'
}
// 上传文件
export const upload = {
  url: '/files/upload/',
  method: 'POST',
  contentType: 'multipart/form-data',
  hideloading: true
}
// 添加参会人获取议程
export const getAddAgenda = {
  url: '/conferenceAgenda/findByConferenceId',
  method: 'GET'
}
// 查询随员人
export const getAttendant = {
  url: '/attendeeManage/list/byAttendeeName',
  method: 'GET'
}
// 参会人列表
export const getAttendeeList = {
  url: '/attendeeManage/list/partIn',
  method: 'GET'
}

// 获取会议首页-我的申请列表
export const getTaskList = {
  // attendeeManage/task/list/partIn
  url: '/attendeeManage/task/list/partIn',
  method: 'GET'
}

// 撤回申请
export const signCancel = {
  url: '/attendeeManage/signCancel',
  method: 'POST',
  contentType: 'application/x-www-form-urlencoded',
  serialize: true
}

// 查询参会人信息  主表或者中间表
export const getAttendeeOrRecord = {
  url: '/attendeeManage/details/findAttendeeOrRecordById',
  method: 'GET'
}

// 请假
export const submitLeave = {
  url: '/attendeeManage/leave/byUserId',
  method: 'POST',
  emulateJSON: true
}

// 陪同人员
export const escort = {
  url: '/conferenceAccompany/list/byAttendeeId',
  method: 'GET'
}
// 我的陪同
export const myEscort = {
  url: '/conferenceAccompany/honour/list/byAttendeeId',
  method: 'GET'
}
// 通过类别获取待审核数量
export const getExamineStatus = {
  url: '/attendeeManage/task/getCommonWaitCountByTypes',
  method: 'GET'
}
// 请假
export const addLeave = {
  url: '/attendeeManage/leave/byUserId',
  method: 'POST',
  emulateJSON: true
}
// 取消报名
export const cacelSignIP = {
  url: '/attendeeManage/cancelAttendeeMetting',
  method: 'POST',
  emulateJSON: true
}
// 审核通过
export const approved = {
  url: '/attendeeManage/signAuditAttendeeWithUpdate',
  method: 'POST',
  emulateJSON: true
}
// 审核驳回
export const reject = {
  url: '/attendeeManage/signAuditAttendee',
  method: 'POST',
  emulateJSON: true
}
// 获取意见审核
export const getVerifyReason = {
  url: '/attendeeManage/getConferenceVerifyReason',
  method: 'GET'
}
// 修改意见审核
export const editVerifyReason = {
  url: '/attendeeManage/updateConferenceVerifyReason',
  method: 'GET'
  // qs: true
}
// 恢复报名资格
export const allowSignUp = {
  url: '/attendeeManage/recoverSignStatus',
  method: 'POST',
  emulateJSON: true
}
// 获取操作记录
export const getHandleRecord = {
  url: '/attendeeManage/details/findAttendeeOrRecordById',
  method: 'GET'
}
// 获取任务列表
export const getTask = {
  url: '/attendeeManage/task/list/organized',
  method: 'GET'
}
// 获取虚拟手机号码
export const getPhone = {
  url: '/conference/getMobileNumber',
  method: 'GET'
}
