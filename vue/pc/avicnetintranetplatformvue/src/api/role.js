/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-11 10:56:07
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-04-13 16:28:33
 */
// 获取角色授权列表
export const roleList = {
  url: '/system/role/list',
  method: 'GET'
}
// 根据roleId获取角色授权列表
export const getRole = {
  url: '/system/role/:roleId',
  method: 'GET'
}
// 新增角色
export const addRole = {
  url: '/system/role',
  method: 'POST'
}
// 修改角色
export const updateRole = {
  url: '/system/role',
  method: 'PUT'
}
// 删除角色
export const delRole = {
  url: '/system/role/:roleId',
  method: 'delete'
}
// 查询角色下的授权用户
export const roleAuthList = {
  url: '/system/role/listRoleUser',
  method: 'GET'
}
// 根据角色ID查询部门树结构
export const roleDeptTreeselect = {
  url: '/system/dept/roleDeptTreeselect/:roleId',
  method: 'GET'
}
// 根据角色ID查询菜单下拉树结构
export const roleMenuTreeselect = {
  url: '/system/menu/roleMenuTreeselect/:roleId',
  method: 'GET'
}
// 角色数据权限
export const dataScope = {
  url: '/system/role/dataScope',
  method: 'PUT'
}
