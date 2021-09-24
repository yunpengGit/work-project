/*
 * @Descripttion:路由数据
 * @Author: zongmz
 * @Date: 2021-04-19 10:07:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-11 12:37:03
 */
import doAndRead from './portal/doAndRead' // 待办待阅
import notice from './portal/notice' // 通知公告
import schedule from './portal/schedule' // 日程管理
import peopleChange from './portal/peopleChange' // 人员动态
import onlinePeople from './portal/onlinePeople' // 在线人员
import leadersWeekly from './portal/leadersWeekly' // 领导一周安排
import addrbook from './portal/addrbook' // 通讯录
import app from './portal/app' // 常用应用
import information from './portal/information' // 资讯栏目
import template from './portal/template' // 模板列表

// import newsManage from './manage/newsManage' // 资讯栏目后台
// import noticeManage from './manage/notice' // 通知公告后台
// import addrbookManage from './manage/addrbookManage' // 通讯录后台
// import appManage from './manage/appManage' // 常用应用后台
// import scheduleManage from './manage/scheduleManage' // 日程管理后台
// scheduleManage
export default [
  doAndRead,
  notice,
  schedule,
  peopleChange,
  onlinePeople,
  leadersWeekly,
  addrbook,
  app,
  information,
  template
  // newsManage
  // noticeManage,
  // addrbookManage,
  // appManage,
  // scheduleManage
]
