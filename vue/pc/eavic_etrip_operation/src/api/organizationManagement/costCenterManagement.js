import { axios } from '../request'

// 部门树获取接口
export function getDeptListByParentId(params) {
  return axios({
    url: '/api/category/dept/getDeptListByParentId',
    method: 'get',
    params
  })
}
// 添加成本中心接口
export function save(params) {
  return axios({
    url: '/api/category/costCenter/save',
    method: 'post',
    data: params
  })
}
// 修改成本中心接口
export function update(params) {
  return axios({
    url: '/api/category/costCenter/update',
    method: 'post',
    data: params
  })
}
// 模糊查询成本中心树接口
export function getLikeQueryByName(params) {
  return axios({
    url: '/api/category/costCenter/getLikeQueryByName',
    method: 'get',
    params
  })
}
// 获取成本中心列表接口
export function getCostCenterVoListByParentId(params) {
  return axios({
    url: '/api/category/costCenter/getCostCenterVoListByParentId',
    method: 'get',
    params
  })
}
// 删除成本中心树接口
export function deleteById(params) {
  return axios({
    url: '/api/category/costCenter/deleteById',
    method: 'get',
    params
  })
}
// 批量删除成本中心树接口
export function deleteByIds(params) {
  return axios({
    url: '/api/category/costCenter/deleteByIds',
    method: 'post',
    data: params
  })
}
