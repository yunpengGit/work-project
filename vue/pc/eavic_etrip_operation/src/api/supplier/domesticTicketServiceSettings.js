import { axios } from '../request'

// 获取所有供应商list
export function getListByParams(params) {
  return axios({
    url: '/api/supplier/supplier/getListByParams',
    method: 'post',
    data: params
  })
}
