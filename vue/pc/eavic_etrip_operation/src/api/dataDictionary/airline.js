import { axios } from '../request'

// 航空公司保存接口
export function save(params) {
  return axios({
    url: '/api/dictionary/airline/save',
    method: 'post',
    data: params
  })
}
// 航空公司修改接口
export function update(params) {
  return axios({
    url: '/api/dictionary/airline/update',
    method: 'post',
    data: params
  })
}
// 航空公司删除接口
export function deleteById(params) {
  return axios({
    url: '/api/dictionary/airline/deleteById',
    method: 'get',
    params
  })
}
// 航空公司批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/dictionary/airline/deleteByIds',
    method: 'get',
    params
  })
}
// 航空公司查看详情接口
export function getSensitiveWordById(params) {
  return axios({
    url: '/api/dictionary/airline/getSensitiveWordById',
    method: 'post',
    data: params
  })
}
// 航空公司列表接口
export function getListByParams(params) {
  return axios({
    url: '/api/dictionary/airline/getListByParams',
    method: 'post',
    data: params
  })
}
// 航空公司分页列表接口
export function getPageByParams(params) {
  return axios({
    url: '/api/dictionary/airline/getPageByParams',
    method: 'get',
    params
  })
}
// 航空公司刷新缓存接口
export function selectAllListByCacheOrDb(params) {
  return axios({
    url: '/api/dictionary/airline/selectAllListByCacheOrDb',
    method: 'post',
    data: params
  })
}
