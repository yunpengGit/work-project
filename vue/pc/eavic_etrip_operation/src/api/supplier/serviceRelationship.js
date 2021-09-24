import { axios } from '../request'

// 供应商联系人保存接口
export function saveBatch(params) {
  return axios({
    url: '/api/supplier/supplierCategoryMid/saveBatch',
    method: 'post',
    data: params
  })
}
// 企业列表接口
export function getCategoryListByParentId(params) {
  return axios({
    url: '/api/category/category/getCategoryListByParentId',
    method: 'get',
    params
  })
}
// 已绑定企业列表接口
export function getListByParams(params) {
  return axios({
    url: '/api/supplier/supplierCategoryMid/getListByParams',
    method: 'get',
    params
  })
}
// 解绑供应商与公司服务关系接口
export function deleteById(params) {
  return axios({
    url: '/api/supplier/supplierCategoryMid/deleteById',
    method: 'get',
    params
  })
}
// 批量解绑供应商与公司服务关系接口
export function deleteBatchById(params) {
  return axios({
    url: '/api/supplier/supplierCategoryMid/deleteBatchById',
    method: 'get',
    params
  })
}
// 获取供应商与服务的公司分页列表接口
export function getPageByParams(params) {
  return axios({
    url: '/api/supplier/supplierCategoryMid/getPageByParams',
    method: 'get',
    params
  })
}
