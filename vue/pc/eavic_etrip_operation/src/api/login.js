import { axios } from './request'

export function login(params) {
  return axios({
    url: '/api/employee/employee/login',
    method: 'get',
    params
  })
}
export function logout() {
  return axios({
    url: '/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
