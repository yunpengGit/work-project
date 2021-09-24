// 查询用户列表
export const list = {
  url: '/system/user/list',
  method: 'GET'
}
// 查询密级字典项
export const mType = {
  url: '/system/dict/data/type/sys_user_secret_level',
  method: 'GET'
}
// 用户详情
export const userDetail = {
  url: '/system/user/:userId',
  method: 'GET'
}
