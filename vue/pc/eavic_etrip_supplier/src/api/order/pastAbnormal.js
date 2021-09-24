import { axios } from '../request'

// 订单查询接口
export function getSupplierAirTicketExceptionOrderListPageByParams(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/getSupplierAirTicketExceptionOrderListPageByParams',
    method: 'post',
    data: params
  })
}
// 订单(单个,批量)修正接口
export function tmcCorrectOrder(params) {
  return axios({
    url: '/api/airplane/supplierAirTicketOrder/tmcCorrectOrder',
    method: 'get',
    params
  })
}
// 编辑订单保存并修正接口
export function updateAndCorrectOrder(params) {
  return axios({
    url: '/api/airplane/supplierAirTicketOrder/updateAndCorrectOrder',
    method: 'post',
    data: params
  })
}
