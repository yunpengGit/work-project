// 获取用户信息
export const userInfo = {
  url: '/user/loginInfo/',
  method: 'GET'
}

// 单点登录
export const ssoLogin = {
  url: '/ssoLogin',
  method: 'POST',
  emulateJSON: true
}

// 我的会议活动列表
export const myMeetingList = {
  url: '/conference/user/partIn',
  method: 'GET'
}

// 会议活动大厅列表
export const meetingList = {
  url: '/conference/lobby',
  method: 'GET'
}

// 获取会议联络人列表
export const getLiaisons = {
  url: '/conferenceContacter/list',
  method: 'GET'
}

// 通过会议ID和userId验证是否可以进入9宫格
export const jumpInSuccessVertify = {
  url: '/attendeeManage/jumpInSuccessVertify/byConferenceId',
  method: 'GET'
}

// 获取会议详情
export const getDetail = {
  url: '/conference/details',
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

// 参会人列表
export const getAttendeeList = {
  url: '/attendeeManage/list/partIn',
  method: 'GET'
}

// 根据id查看参会人信息
export const getAttendeeDetail = {
  url: '/attendeeManage/details',
  method: 'GET',
  hideloading: true
}

// 通过会议id查看当前登录用户的参会人详情
export const getAttendeeFromMeetingId = {
  url: '/attendeeManage/details/byConferenceId',
  method: 'GET'
}

// 获取议程信息
export const getAgenda = {
  url: '/conferenceAgenda/getAgendaAttendeeListByUser',
  method: 'GET',
  hideloading: true
}

// 获取议程详情
export const getAgendaDetail = {
  url: '/conferenceAgenda/findById',
  method: 'GET'
}

// 获取会议座位图
export const getSeat = {
  url: '/seatingPlan/seat',
  method: 'GET',
  hideloading: true
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

// 获取会议首页-我的申请列表
export const getTaskList = {
  url: '/attendeeManage/task/list/partIn',
  method: 'GET'
}

// 撤回报名待审核为草稿
export const signCancel = {
  url: '/attendeeManage/signCancel',
  method: 'POST',
  qs: true
}

// 取消参会
export const cancelApply = {
  url: '/attendeeManage/task/applyForcancelMetting',
  method: 'POST',
  emulateJSON: true
}

// 我作为参会人的申请
export const mySelfapply = {
  url: '/attendeeManage/task/list/myselfPartIn',
  method: 'GET'
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

// 参会人获取报名表单项
export const getForms = {
  url: '/attendeeManage/getSignForm',
  method: 'GET'
}

// 外部 会议报名表单项
export const getWebForms = {
  url: '/attendeeManage/web/getSignForm',
  method: 'GET'
}

// 上传文件
export const upload = {
  url: '/files/upload/',
  method: 'POST',
  contentType: 'multipart/form-data',
  hideloading: true
}

// 暂存
export const addInsert = {
  url: '/attendeeManage/insert',
  method: 'POST',
  emulateJSON: true
}

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

// 添加参会人 - 标签获取
export const getLabel = {
  url: '/conferenceTag/getList',
  method: 'GET'
}

// 获取性别
export const getSex = {
  url: '/dictionary/sex/dictionaryValue',
  method: 'GET'
}

// 获取职位级别
export const getLevel = {
  url: '/dictionary/positionLevel/dictionaryValue',
  method: 'GET'
}

// 获取证件类型
export const getCardType = {
  url: '/dictionary/cardType/dictionaryValue',
  method: 'GET'
}

// 获取民族
export const getNation = {
  url: '/dictionary/nation/dictionaryValue',
  method: 'GET'
}

// 添加参会人获取议程
export const getAddAgenda = {
  url: '/conferenceAgenda/findByConferenceId',
  method: 'GET'
}

// 获取会议报名设置
export const getRegSettings = {
  url: '/conferenceSignConfig/getByConferenceId',
  method: 'GET'
}

/**
 * 查询联络人 contacterRoleIds = 1
 * 1 会议联络人
 * 2 车辆联络人
 * 3 住宿联络人
 * 4 餐饮联络人
 * 5 票证联络人
 */
export const getContacter = {
  url: '/conferenceContacter/list',
  method: 'GET'
}

// 查询参会人下的用车任务
export const getCarTask = {
  url: '/synergy/vehicle/task/attendee/vehicle',
  method: 'GET'
}

// 更新任务状态
// export const updateTaskStatus = {
//   url: '/synergy/driver/app/updateTaskStatus',
//   method: 'GET'
// }

// 更新任务状态
export const updateTaskStatus = {
  url: '/synergy/vehicle/task/pickOnAttendee',
  method: 'POST',
  emulateJSON: true
}

// 获取用车人员列表
export const getCarAttendee = {
  url: '/synergy/vehicle/task/attendee/list',
  method: 'GET'
}

// 获取专车人员列表
export const getSpecialCarAttendee = {
  url: '/synergy/vehicle/task/special/attendee/list',
  method: 'GET'
}

// 查询参会人下的专车任务
export const getSpecialCarTask = {
  url: '/synergy/vehicle/task/special/attendee/vehicle',
  method: 'GET'
}

// 参会人用车日历
export const getCarDate = {
  url: '/synergy/vehicle/task/attendee/task/dateList',
  method: 'GET'
}

// 查询参会人下的住宿任务
export const getRoomTask = {
  url: '/synergy/room/task/attendee/room',
  method: 'GET'
}

// 查询参会人下的票证任务
export const getCardTask = {
  url: '/synergy/card/attendee/card',
  method: 'GET'
}

// 根据参会人id查询用餐任务
export const getDinnerTask = {
  url: '/synergy/dining/task/attendee/dinner',
  method: 'GET'
}

// 参会人用餐日历
export const getDinnerDate = {
  url: '/synergy/dining/task/attendee/task/dateList',
  method: 'GET'
}

// // 外部 会议详情
// export const getWebDetail = {
//   url: '/conference/web/details',
//   method: 'GET'
// }

// 外部 获取验证码
export const getWebCode = {
  url: '/shortMessage/verificationCode',
  method: 'POST',
  qs: true
}

// 外部 验证码登录
export const webLogin = {
  url: '/login/verificationCode',
  method: 'POST',
  emulateJSON: true
}

// 参会人扫码报道
export const handleReport = {
  url: '/attendeeManage/checkIn/byUserId',
  method: 'POST',
  qs: true
}

// 参会人扫码签到
export const handleSignIn = {
  url: '/attendeeManage/signInByAttendee',
  method: 'POST'
  // qs: true
}

// 参会人扫码签到议程
export const handleSignInAgenda = {
  url: '/attendeeManage/agendaSignIn/byUserId',
  method: 'POST',
  qs: true
}

// 外部 验证码登录
export const webVerify = {
  url: '/login/verificationCode',
  method: 'GET'
}

// 内部 获取邀请状态
export const getWebStatus = {
  url: '/conferenceInviteUser/fingStatusById',
  method: 'GET'
}

// 根据邀请id获取验证码
export const getVerificationCode = {
  url: '/conferenceInviteUser/verificationCode',
  method: 'GET'
}

// 内部 接收/拒绝邀请
export const refuseInvitation = {
  url: '/conferenceInviteUser/updateInviteStatus',
  method: 'GET'
}

// 邀请函代办转发IM
export const sendInviteAgent = {
  url: '/conferenceInviteUser/sendInviteAgentIM',
  method: 'POST',
  qs: true
}

// 邀请函详情
export const invitationDetail = {
  url: '/conferenceInviteUser/details',
  method: 'GET'
}

// 外部 接收/拒绝邀请
// export const getWebStatus= {
//   url: '/conferenceInviteUser/shortMessage/verificationCode',
//   method: 'GET'
// }

// 获取参会人信息完整性
export const getApplyCompleteFlag = {
  url: '/attendeeManage/getInformationCompleteFlag',
  method: 'GET'
}

// 获取操作记录
export const getHandleRecord = {
  url: '/attendeeManage/details/findAttendeeOrRecordById',
  method: 'GET'
}

// 查询参会人是否有新任务
export const getNewTaskFlag = {
  url: '/attendeeManage/getNewTaskFlag',
  method: 'GET',
  hideloading: true
}

// 转换图片地址
export const getDownloadUrl = {
  url: '/files/getDownloadUrl',
  method: 'GET'
}
// 查询随员人
export const getAttendant = {
  url: '/attendeeManage/list/byAttendeeName',
  method: 'GET'
}
