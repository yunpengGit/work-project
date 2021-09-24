import { axios } from '../request'

// 供应商保存接口
export function save(params) {
  return axios({
    url: '/api/supplier/supplier/save',
    method: 'post',
    data: params
  })
}
// 供应商保存接口
export function update(params) {
  return axios({
    url: '/api/supplier/supplier/update',
    method: 'post',
    data: params
  })
}
// 供应商批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/supplier/supplier/deleteByIds',
    method: 'get',
    params
  })
}

// 供应商删除接口
export function deleteById(params) {
  return axios({
    url: '/api/supplier/supplier/deleteById',
    method: 'get',
    params
  })
}
// 供应商分页列表接口
export function getPageByParams(params) {
  return axios({
    url: '/api/supplier/supplier/getPageByParams',
    method: 'get',
    params
  })
}
// 供应商logo接口
export function uploadLogo(params) {
  return axios({
    url: '/api/supplier/supplier/uploadLogo',
    method: 'post',
    data: params
  })
}
