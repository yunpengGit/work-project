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
