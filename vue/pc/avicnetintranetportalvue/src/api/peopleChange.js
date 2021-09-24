/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-23 11:07:16
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-27 13:12:37
 */
// 获取列表
export const getList = {
  url: '/portal/dynamic/list',
  method: 'GET'
}
// 获取可移交流程列表
export const getModule = {
  url: '/portal/dynamic/module/list',
  method: 'GET'
}
// 获取休假类型
export const getVacation = {
  url: '/system/dict/data/type/dynamic_vacation_type',
  method: 'GET'
}
// 获取外出类型
export const getOut = {
  url: '/system/dict/data/type/dynamic_outgoing_type',
  method: 'GET'
}

// 新增
export const addChange = {
  url: '/portal/dynamic',
  method: 'POST'
}
// 查询部门
export const getDep = {
  url: '/system/user/info/userId/:userId',
  method: 'GET'
}
// 检查接收人的时间是否冲突
export const checkTime = {
  url: '/portal/dynamic/receive/user/check',
  method: 'POST'
}
// 是否是部门助理、获取部门和公司id
export const isAcc = {
  url: '/portal/dynamic/user/assistant',
  method: 'GET'
}
// 获取接收人列表
export const getReceive = {
  url: '/system/user/list',
  method: 'GET'
}
// 查看人员动态详情
export const changeDetail = {
  url: '/portal/dynamic/detail/:dynamicId',
  method: 'GET'
}
// 注销人员动态
export const revokeData = {
  url: '/portal/dynamic/revoke/:dynamicId',
  method: 'POST'
}
// 更新人员动态
export const updateChange = {
  url: '/portal/dynamic',
  method: 'PUT'
}
