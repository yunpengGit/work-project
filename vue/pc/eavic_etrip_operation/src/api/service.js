/*
 * 权限管理api
 */
import { axios } from './request'

// 权限uri保存接口
export function saveUri(data) {
  return axios({
    url: '/api/employee/limituri/save',
    method: 'post',
    data
  })
}
// 权限uri修改接口
export function updateUri(data) {
  return axios({
    url: '/api/employee/limituri/update',
    method: 'post',
    data
  })
}
// 权限uri删除接口
export function deleteByIdUri(params) {
  return axios({
    url: '/api/employee/limituri/deleteById',
    method: 'get',
    params
  })
}
// 权限uri批量删除接口
export function deleteByIdsUri(params) {
  return axios({
    url: '/api/employee/limituri/deleteByIds',
    method: 'get',
    params
  })
}
// 权限uri分页接口
export function getPageByParamsUri(params) {
  return axios({
    url: '/api/employee/limituri/getPageByParams',
    method: 'get',
    params
  })
}
// 角色保存接口
export function saveRoles(data) {
  return axios({
    url: '/api/employee/role/save',
    method: 'post',
    data
  })
}
// 角色修改接口
export function updateRoles(data) {
  return axios({
    url: '/api/employee/role/update',
    method: 'post',
    data
  })
}
// 角色分页接口
export function getPageByParamsRoles(params) {
  return axios({
    url: '/api/employee/role/getPageByParams',
    method: 'get',
    params
  })
}
// 角色刷新所有角色对应的权限uri缓存接口
export function refreshAllCache(data) {
  return axios({
    url: '/api/employee/role/refreshAllCache',
    method: 'post',
    data
  })
}
// 角色删除接口
export function deleteByIdRoles(params) {
  return axios({
    url: '/api/employee/role/deleteById',
    method: 'get',
    params
  })
}
// 角色刷新指定角色对应的权限uri缓存接口
export function refreshRoleCacheById(params) {
  return axios({
    url: '/api/employee/role/refreshRoleCacheByIds',
    method: 'get',
    params
  })
}
// 角色根据roleId获取权限组列表接口
export function getLimitgroupListByRoleId(params) {
  return axios({
    url: '/api/employee/role/getLimitgroupListByRoleId',
    method: 'get',
    params
  })
}
// 权限组树查询接口
export function getLimitgroupTreeByName(params) {
  return axios({
    url: '/api/employee/limitgroup/getLimitgroupTreeByName',
    method: 'get',
    params
  })
}
// 权限组ID查询接口
export function getById(params) {
  return axios({
    url: '/api/employee/limitgroup/getById',
    method: 'get',
    params
  })
}
// 权限组获取uri列表接口 全量查所有已绑定的uri
export function getLimituriListByLimitgroupId(params) {
  return axios({
    url: '/api/employee/limitgroup/getLimituriListByLimitgroupId',
    method: 'get',
    params
  })
}
// 权限组保存接口
export function saveGroup(data) {
  return axios({
    url: '/api/employee/limitgroup/save',
    method: 'post',
    data
  })
}
// 权限组修改接口
export function updateGroup(data) {
  return axios({
    url: '/api/employee/limitgroup/update',
    method: 'post',
    data
  })
}
// 权限uri-根据权限组ID获取权限uri分页  已绑定链接列表
export function getLimituriPageByLimitgroupId(params) {
  return axios({
    url: '/api/employee/limituri/getLimituriPageByLimitgroupId',
    method: 'get',
    params
  })
}
// 权限组URI批量绑定uri接口
export function saveBatch(params) {
  return axios({
    url: '/api/employee/limitgroupLimituri/saveBatch',
    method: 'get',
    params
  })
}
// 权限组URI根据权限uriID删除绑定关系接口 (暂不需要)
export function deleteByLimituriId(params) {
  return axios({
    url: '/api/employee/limitgroupLimituri/deleteByLimituriId',
    method: 'get',
    params
  })
}
// 权限组删除接口
export function deleteByIdGroup(params) {
  return axios({
    url: '/api/employee/limitgroup/deleteById',
    method: 'get',
    params
  })
}
// 权限组URI根据权限组ID和权限uriIds删除绑定关系接口
export function deleteByLimitgroupIdAndLimituriIds(params) {
  return axios({
    url: '/api/employee/limitgroupLimituri/deleteByLimitgroupIdAndLimituriIds',
    method: 'get',
    params
  })
}
