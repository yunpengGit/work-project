import { axios } from '../request'

// 服务商与模板分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/supplier/supplierTemplateMid/getPageByParams',
    method: 'get',
    params
  })
}
// 服务商模板保存接口
export function save(params) {
  return axios({
    url: '/api/supplier/supplierTemplateMid/save',
    method: 'post',
    data: params
  })
}
// 服务商模板删除接口
export function deleteById(params) {
  return axios({
    url: '/api/supplier/supplierTemplateMid/deleteById',
    method: 'get',
    params
  })
}
// 服务商模板列表查询接口
export function getListByParamsSuppiler(params) {
  return axios({
    url: '/api/supplier/supplierTemplateMid/getListByParams',
    method: 'get',
    params
  })
}
// 服务商模板批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/supplier/supplierTemplateMid/deleteByIds',
    method: 'get',
    params
  })
}
