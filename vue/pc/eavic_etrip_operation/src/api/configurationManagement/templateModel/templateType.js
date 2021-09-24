import { axios } from '../../request'

// 模板类型分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/category/templateType/getPageByParams',
    method: 'get',
    params
  })
}
// 模板类型保存接口
export function templateTypeSave(params) {
  return axios({
    url: '/api/category/templateType/save',
    method: 'post',
    data: params
  })
}
// 模板类型修改接口
export function templateTypeUpdate(params) {
  return axios({
    url: '/api/category/templateType/update',
    method: 'post',
    data: params
  })
}
// 模板类型删除接口
export function templateTypeDeleteById(params) {
  return axios({
    url: '/api/category/templateType/deleteById',
    method: 'get',
    params
  })
}
// 模板类型批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/category/templateType/deleteByIds',
    method: 'get',
    params
  })
}
