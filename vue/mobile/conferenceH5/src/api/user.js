/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-07-28 19:51:43
 */
// axios
// 登录
export const login = {
  url: 'login',
  method: 'POST',
  emulateJSON: true
}
// 获取用户信息
export const userInfo = {
  url: '/user/loginInfo/',
  method: 'GET'
}

export const ssoLogin = {
  url: '/ssoLogin',
  method: 'POST',
  emulateJSON: true
}

// export function ssoLogin(data) {
//   return request({
//     url: '/ssoLogin',
//     method: 'POST',
//     data: data
//   })
// }
