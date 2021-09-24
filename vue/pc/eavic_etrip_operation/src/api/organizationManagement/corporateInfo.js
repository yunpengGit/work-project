import { axios } from '../request'
// 企业信息管理页面相关服务
// 企业服务
export function getCategoryListByParentId(params) {
  return axios({
    url: '/api/category/category/getCategoryListByParentId',
    method: 'get',
    params
  })
}
// 企业详细信息接口
export function getCategoryById(params) {
  return axios({
    url: '/api/category/category/getCategoryById',
    method: 'get',
    params
  })
}
// 部门列表接口
export function getDeptListByParentId(params) {
  return axios({
    url: '/api/category/dept/getDeptListByParentId',
    method: 'get',
    params
  })
}
// 部门详细信息接口
export function getDeptById(params) {
  return axios({
    url: '/api/category/dept/getDeptById',
    method: 'get',
    params
  })
}
// 人员列表分页查询接口
export function getPersonListByCategoryId(params) {
  return axios({
    url: '/api/category/person/getPersonListByCategoryId',
    method: 'get',
    params
  })
}
// 人员详细信息接口
export function getPersonById(params) {
  return axios({
    url: '/api/category/person/getPersonById',
    method: 'get',
    params
  })
}
// 公司职级接口
export function getCategoryJobDutyList(params) {
  return axios({
    url: '/api/category/dics/getCategoryJobDutyList',
    method: 'get',
    params
  })
}
// 人员证件获取接口
export function getPersonCardList(params) {
  return axios({
    url: '/api/category/personcard/getPersonCardList',
    method: 'get',
    params
  })
}
