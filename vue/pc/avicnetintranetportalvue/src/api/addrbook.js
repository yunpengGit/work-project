/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-05-08 11:37:01
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-05-14 13:16:46
 */
export const orgTree = {
  url: '/portal/addrbook/manager/orgs',
  method: 'GET'
}

export const orgUserList = {
  url: '/portal/addrbook/manager/orgs/:orgId/users',
  method: 'GET'
}

export const searchOrgTree = {
  url: '/portal/addrbook/manager/companies/search',
  method: 'GET'
}

export const setAuthority = {
  emulateJSON: true,
  url: '/portal/addrbook/users/:userId/addrbookViewPerms',
  method: 'PUT'
}

export const setPrivacy = {
  url: '/portal/addrbook/users/:userId/privacyLevel',
  method: 'PUT',
  emulateJSON: true
}

export const privacyList = {
  url: '/portal/addrbook/privacy/metaData',
  method: 'get'
}

export const setPrivacyList = {
  url: '/portal/addrbook/privacyLevelRules',
  method: 'put'
}

// new
// 根据搜索条件查询对应的树
export const searchUnit = {
  url: '/portal/addrbook/user/companies/search',
  method: 'GET'
}
// 根据人员或者组织id查询列表
export const getUnitList = {
  url: '/portal/addrbook/users',
  method: 'GET'
}
// 根据上级组织id查询树
export const getUnitTree = {
  url: '/portal/addrbook/user/orgs',
  method: 'GET'
}
