import { axios } from '../request'

// 供应商订单设置编辑接口
export function save(params) {
  return axios({
    url: '/api/airplane/supplierOrderSetting/save',
    method: 'post',
    data: params
  })
}
// 供应商订单设置详情接口
export function getByParams(params) {
  return axios({
    url: '/api/airplane/supplierOrderSetting/getByParams',
    method: 'get',
    params
  })
}
