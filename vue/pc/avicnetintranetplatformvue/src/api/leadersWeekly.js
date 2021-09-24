/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-26 11:43:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-01 18:37:48
 */
// 权限设置列表
export const authList = {
  url: '/portal/plan/auth/list',
  method: 'GET'
}

// 单条权限详情
export const authInfo = {
  url: '/portal/plan/auth/:leaderId',
  method: 'GET'
}

// 单条权限删除
export const authDelete = {
  url: '/portal/plan/auth/:leaderId',
  method: 'DELETE'
}

// 单条权限新增
export const authAdd = {
  url: '/portal/plan/auth',
  method: 'POST'
}

// 单条权限编辑
export const authEdit = {
  url: '/portal/plan/auth',
  method: 'PUT'
}

// 领导列表查询
export const leaders = {
  url: '/portal/plan/auth/list/leaders',
  method: 'GET'
}

// 导出安排
export const exportPlan = {
  url: '/portal/plan/export',
  method: 'GET'
}

// 新增安排
export const addPlan = {
  url: '/portal/plan',
  method: 'POST'
}

// 编辑安排
export const editPlan = {
  url: '/portal/plan',
  method: 'PUT'
}

// 删除安排
export const deletePlan = {
  url: '/portal/plan/:id',
  method: 'DELETE'
}

// 安排日历查询
export const planList = {
  url: '/portal/plan/list',
  method: 'GET'
}

// 清除状态
export const clearStatus = {
  url: '/portal/plan/updateStatus/clear',
  method: 'PUT'
}

// 安排排序
export const orderPlan = {
  url: '/portal/plan/order/:planIds',
  method: 'PUT'
}
