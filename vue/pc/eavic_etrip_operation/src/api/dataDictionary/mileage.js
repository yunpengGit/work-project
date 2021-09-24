import { axios } from '../request'

// 里程保存接口
export function save(params) {
  return axios({
    url: '/api/dictionary/mileage/save',
    method: 'post',
    data: params
  })
}
// 里程修改接口
export function update(params) {
  return axios({
    url: '/api/dictionary/mileage/update',
    method: 'post',
    data: params
  })
}
// 里程删除接口
export function deleteById(params) {
  return axios({
    url: '/api/dictionary/mileage/deleteById',
    method: 'get',
    params
  })
}
// 里程批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/dictionary/mileage/deleteByIds',
    method: 'get',
    params
  })
}
// 里程查看详情接口
export function getSensitiveWordById(params) {
  return axios({
    url: '/api/dictionary/mileage/getSensitiveWordById',
    method: 'post',
    data: params
  })
}
// 里程列表接口
export function getListByParams(params) {
  return axios({
    url: '/api/dictionary/mileage/getListByParams',
    method: 'post',
    data: params
  })
}
// 里程分页列表接口
export function getPageByParams(params) {
  return axios({
    url: '/api/dictionary/mileage/getPageByParams',
    method: 'get',
    params
  })
}
// 里程刷新缓存接口
export function selectAllListByCacheOrDb(params) {
  return axios({
    url: '/api/dictionary/mileage/selectAllListByCacheOrDb',
    method: 'post',
    data: params
  })
}
