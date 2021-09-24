import { axios } from '../request'

// 获取所有供应商list
export function getListByParams(params) {
  return axios({
    url: '/api/supplier/supplierCategoryMid/getListByParams',
    method: 'post',
    params
  })
}
