/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-08 14:31:10
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-04-15 00:54:07
 */
// 获取角色授权列表
export const roleList = {
  url: '/system/role/listWithCount',
  method: 'GET'
}
// 查询用户并标记是否含有某种角色
export const getGivenRole = {
  url: '/system/user/queryUserListMarkedByRole',
  method: 'GET'
}
// 查询角色下的授权用户
export const roleAuthList = {
  url: '/system/role/listRoleUser',
  method: 'GET'
}
// 角色批量删除用户
export const delAuthRole = {
  url: '/system/role/deleteUserRoleByRoleIdBatch',
  emulateJSON: true,
  method: 'POST'
}
// 根据名称查询企业树
export const nameDepts = {
  url: '/system/dept/cascadeTree',
  method: 'GET'
}
// 角色批量添加用户
export const addAuthRole = {
  url: '/system/role/addUserRoleByRoleIdBatch',
  emulateJSON: true,
  method: 'POST'
}

