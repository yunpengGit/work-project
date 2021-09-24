import { axios } from '../request'

// 机场保存接口
export function save(params) {
  return axios({
    url: '/api/dictionary/airport/save',
    method: 'post',
    data: params
  })
}
// 机场修改接口
export function update(params) {
  return axios({
    url: '/api/dictionary/airport/update',
    method: 'post',
    data: params
  })
}
// 机场删除接口
export function deleteById(params) {
  return axios({
    url: '/api/dictionary/airport/deleteById',
    method: 'get',
    params
  })
}
// 机场批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/dictionary/airport/deleteByIds',
    method: 'get',
    params
  })
}
// 机场查看详情接口
export function getSensitiveWordById(params) {
  return axios({
    url: '/api/dictionary/airport/getSensitiveWordById',
    method: 'post',
    data: params
  })
}
// 机场列表接口
export function getListByParams(params) {
  return axios({
    url: '/api/dictionary/airport/getListByParams',
    method: 'post',
    data: params
  })
}
// 机场分页列表接口
export function getPageByParams(params) {
  return axios({
    url: '/api/dictionary/airport/getPageByParams',
    method: 'get',
    params
  })
}
// 机场刷新缓存接口
export function selectAllListByCacheOrDb(params) {
  return axios({
    url: '/api/dictionary/airport/selectAllListByCacheOrDb',
    method: 'post',
    data: params
  })
}
