import { axios } from '../request'
// 原始账单分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/airplane/adminAirTicketBill/getPageByParams',
    method: 'post',
    data: params
  })
}
// 测试接口

export function getPdf(params) {
  return axios({
    url: '/api/airplane/categoryAirTicketOrder/getPdf',
    method: 'get',
    params
  })
}
