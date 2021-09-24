import { axios } from '../request'

// 供应商联系人保存接口
export function save(params) {
  return axios({
    url: '/api/supplier/supplierContactMid/save',
    method: 'post',
    data: params
  })
}
// 供应商联系人修改接口
export function update(params) {
  return axios({
    url: '/api/supplier/supplierContactMid/update',
    method: 'post',
    data: params
  })
}
// 供应商联系人删除接口
export function deleteById(params) {
  return axios({
    url: '/api/supplier/supplierContactMid/deleteById',
    method: 'get',
    params
  })
}
// 供应商联系人批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/supplier/supplierContactMid/deleteByIds',
    method: 'get',
    params
  })
}
// 供应商联系人查看详情接口
export function getSensitiveWordById(params) {
  return axios({
    url: '/api/supplier/supplierContact/getSensitiveWordById',
    method: 'post',
    data: params
  })
}
// 供应商联系人列表接口
export function getPageByParams(params) {
  return axios({
    url: '/api/supplier/supplierContactMid/getPageByParams',
    method: 'get',
    params
  })
}
// 供应商联系人分页列表接口
export function getContactListByParams(params) {
  return axios({
    url: '/api/supplier/supplierContact/getContactListByParams',
    method: 'post',
    data: params
  })
}
// 供应商联系人刷新缓存接口
export function selectAllListByCacheOrDb(params) {
  return axios({
    url: '/api/supplier/supplierContact/selectAllListByCacheOrDb',
    method: 'post',
    data: params
  })
}
