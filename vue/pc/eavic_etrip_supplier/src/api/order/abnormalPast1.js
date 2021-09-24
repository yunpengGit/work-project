import { axios } from '../request'

// 分页查询往期异常订单接口
export function getSupplierAirTicketExceptionOrderListPageByParams(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/getSupplierAirTicketExceptionOrderListPageByParams',
    method: 'get',
    params
  })
}
