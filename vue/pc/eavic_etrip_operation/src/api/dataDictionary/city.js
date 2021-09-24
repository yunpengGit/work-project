import { axios } from '../request'

// 城市保存接口
export function save(params) {
  return axios({
    url: '/api/dictionary/city/save',
    method: 'post',
    data: params
  })
}
// 城市修改接口
export function update(params) {
  return axios({
    url: '/api/dictionary/city/update',
    method: 'post',
    data: params
  })
}
// 城市删除接口
export function deleteById(params) {
  return axios({
    url: '/api/dictionary/city/deleteById',
    method: 'get',
    params
  })
}
// 城市批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/dictionary/city/deleteByIds',
    method: 'get',
    params
  })
}
// 城市查看详情接口
export function getSensitiveWordById(params) {
  return axios({
    url: '/api/dictionary/city/getSensitiveWordById',
    method: 'post',
    data: params
  })
}
// 城市列表接口
export function getListByParams(params) {
  return axios({
    url: '/api/dictionary/city/getListByParams',
    method: 'post',
    data: params
  })
}
// 城市分页列表接口
export function getPageByParams(params) {
  return axios({
    url: '/api/dictionary/city/getPageByParams',
    method: 'get',
    params
  })
}
// 城市刷新缓存接口
export function selectAllListByCacheOrDb(params) {
  return axios({
    url: '/api/dictionary/city/selectAllListByCacheOrDb',
    method: 'post',
    data: params
  })
}
