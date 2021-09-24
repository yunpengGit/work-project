export const orgTopTree = {
  url: '/portal/addrbook/onlineUser/getOnlineUserCount',
  method: 'GET'
}
// 根据组织id查询直接下级部门 ,并带上在线人员总数
export const orgTree = {
  url: '/portal/addrbook/onlineUser/getDeptListByDeptId',
  method: 'GET'
}
// 根据组织id及搜索条件查询直接下级部门 ,并带上在线人员列表
export const orgUser = {
  url: '/portal/addrbook/onlineUser/getOnlineUserByDeptId',
  method: 'GET'
}
