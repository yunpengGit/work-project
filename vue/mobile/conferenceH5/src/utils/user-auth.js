/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-28 18:46:32
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-07-28 19:02:17
 */
import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
