/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-26 22:50:00
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-27 14:08:13
 */
// 我的会议活动列表
export const myMeetingList = {
  url: '/conference/user/organized',
  method: 'GET'
}
// 会议活动大厅列表
export const meetingList = {
  url: '/conference/lobby',
  method: 'GET'
  // qs: true
}
// 获取待办事项
export const taskNum = {
  url: '/attendeeManage/task/count',
  method: 'GET'
}
// 获取待办数量
export const taskCount = {
  url: '/attendeeManage/task/count',
  method: 'GET'
}

