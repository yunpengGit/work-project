/*
 * @Author: pengpeng
 * @Date: 2020-05-27 13:06:31
 * @Last Modified by: pengpeng
 * @Last Modified time: 2020-05-27 15:46:51
 *
 * 使用axios.create请求时需要注意：get，post传参方式
 * get: params
 * post: data
 */
import { axios } from '../request'

// 敏感字保存接口
export function save(params) {
  return axios({
    url: '/api/dictionary/sensitiveWord/save',
    method: 'post',
    data: params
  })
}
// 敏感字修改接口
export function update(params) {
  return axios({
    url: '/api/dictionary/sensitiveWord/update',
    method: 'post',
    data: params
  })
}
// 敏感字删除接口
export function deleteById(params) {
  return axios({
    url: '/api/dictionary/sensitiveWord/deleteById',
    method: 'get',
    params
  })
}
// 敏感字批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/dictionary/sensitiveWord/deleteByIds',
    method: 'get',
    params
  })
}
// 敏感字查看详情接口
export function getSensitiveWordById(params) {
  return axios({
    url: '/api/dictionary/sensitiveWord/getSensitiveWordById',
    method: 'post',
    data: params
  })
}
// 敏感字列表接口
export function getListByParams(params) {
  return axios({
    url: '/api/dictionary/sensitiveWord/getListByParams',
    method: 'post',
    data: params
  })
}
// 敏感字分页列表接口
export function getPageByParams(params) {
  return axios({
    url: '/api/dictionary/sensitiveWord/getPageByParams',
    method: 'get',
    params
  })
}
// 敏感字刷新缓存接口
export function selectAllListByCacheOrDb(params) {
  return axios({
    url: '/api/dictionary/sensitiveWord/selectAllListByCacheOrDb',
    method: 'post',
    data: params
  })
}
