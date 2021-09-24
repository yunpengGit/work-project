import Cookies from 'js-cookie'

const TokenKey = 'Token'
const CanaryKey = 'users_from_Beijing'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
export function removeCanary () {
  return Cookies.remove(CanaryKey)
}

export function setCanary (canary) {
  return Cookies.set(CanaryKey, canary)
}
