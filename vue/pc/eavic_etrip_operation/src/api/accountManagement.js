import { axios } from './request'
// 账户管理页面相关服务
// 用户分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/employee/employee/getPageByParams',
    method: 'get',
    params
  })
}
// 获取供应商信息所有列表接口
export function getSupplierListByParams(data) {
  return axios({
    url: '/api/supplier/supplier/getListByParams',
    method: 'post',
    data
  })
}
// 角色列表接口
export function getListByParams(params) {
  return axios({
    url: '/api/employee/role/getListByParams',
    method: 'get',
    params
  })
}
// 用户保存接口
export function save(data) {
  return axios({
    url: '/api/employee/employee/save',
    method: 'post',
    data
  })
}
// 用户修改接口
export function update(data) {
  return axios({
    url: '/api/employee/employee/update',
    method: 'post',
    data
  })
}
// 用户批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/employee/employee/deleteByIds',
    method: 'get',
    params
  })
}
// 用户删除接口 改用为逻辑删除
export function deleteById(params) {
  return axios({
    url: '/api/employee/employee/deleteLogicById',
    method: 'get',
    params
  })
}
// 用户批量冻结或解冻接口
export function freezeEmployee(params) {
  return axios({
    url: '/api/employee/employee/freezeEmployee',
    method: 'get',
    params
  })
}
