import { axios } from '../../request'

// 公司与模板分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/category/categoryTemplateMid/getPageByParams',
    method: 'get',
    params
  })
}
// 公司模板列表查询接口
export function getListByParams(params) {
  return axios({
    url: '/api/category/categoryTemplateMid/getListByParams',
    method: 'get',
    params
  })
}
// 模板类型树结构查询接口
export function getTreeByParams(params) {
  return axios({
    url: '/api/category/templateType/getTreeByParams',
    method: 'get',
    params
  })
}
// 公司模板保存接口
export function save(params) {
  return axios({
    url: '/api/category/categoryTemplateMid/save',
    method: 'post',
    data: params
  })
}
// 模板列表查询接口
export function getListByParamsTemplate(params) {
  return axios({
    url: '/api/category/template/getListByParams',
    method: 'get',
    params
  })
}
// 公司模板删除接口
export function deleteById(params) {
  return axios({
    url: '/api/category/categoryTemplateMid/deleteById',
    method: 'get',
    params
  })
}
// 公司模板批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/category/categoryTemplateMid/deleteByIds',
    method: 'get',
    params
  })
}
