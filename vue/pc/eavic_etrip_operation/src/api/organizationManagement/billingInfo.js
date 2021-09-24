import { axios } from '../request'
// 公司专票分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/category/categoryInvoiceInfo/getPageByParams',
    method: 'get',
    params
  })
}
// 公司专票保存接口
export function save(params) {
  return axios({
    url: '/api/category/categoryInvoiceInfo/save',
    method: 'post',
    data: params
  })
}
// 公司专票修改接口
export function update(params) {
  return axios({
    url: '/api/category/categoryInvoiceInfo/update',
    method: 'post',
    data: params
  })
}
// 公司专票删除接口
export function deleteById(params) {
  return axios({
    url: '/api/category/categoryInvoiceInfo/deleteById',
    method: 'get',
    params
  })
}
// 公司专票批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/category/categoryInvoiceInfo/deleteByIds',
    method: 'get',
    params
  })
}
// 公司专票ID查询接口
export function getById(params) {
  return axios({
    url: '/api/category/categoryInvoiceInfo/getById',
    method: 'get',
    params
  })
}
