import { axios } from '../../request'

// 模板类型列表查询接口
export function getListByParamsTemplateType(params) {
  return axios({
    url: '/api/category/templateType/getListByParams',
    method: 'get',
    params
  })
}
// 模板分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/category/template/getPageByParams',
    method: 'get',
    params
  })
}
// 模板保存接口
export function save(params) {
  return axios({
    url: '/api/category/template/save',
    method: 'post',
    data: params
  })
}
// 模板修改接口
export function update(params) {
  return axios({
    url: '/api/category/template/update',
    method: 'post',
    data: params
  })
}
// 模板删除接口
export function deleteById(params) {
  return axios({
    url: '/api/category/template/deleteById',
    method: 'get',
    params
  })
}
// 模板批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/category/template/deleteByIds',
    method: 'get',
    params
  })
}
