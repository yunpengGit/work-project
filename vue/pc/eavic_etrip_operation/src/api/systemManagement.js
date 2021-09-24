import { axios } from './request'

// 角色列表接口
export function getListByParams(params) {
  return axios({
    url: '/api/limit/role/getListByParams',
    method: 'post',
    data: params
  })
}
// 角色分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/employee/role/getPageByParams',
    method: 'post',
    data: params
  })
}
