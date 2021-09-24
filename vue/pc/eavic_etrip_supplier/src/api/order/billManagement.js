import { axios } from '../request'

// 原始账单分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/airplane/airTicketBill/getPageByParams',
    method: 'get',
    params
  })
}
// 原始账单插入订单接口
export function insertAirTicketOrder(params) {
  return axios({
    url: '/api/airplane/airTicketBill/insertAirTicketOrder',
    method: 'get',
    params
  })
}
// 要插入的订单分页列表接口
export function getInsertAirTicektOrderPageByParam(params) {
  return axios({
    url: '/api/airplane/airTicketBill/getInsertAirTicektOrderPageByParam',
    method: 'post',
    data: params
  })
}
// 原始账单发送至企业接口
export function sendToCategory(params) {
  return axios({
    url: '/api/airplane/airTicketBill/sendToCategory',
    method: 'post',
    data: params
  })
}
// 原始账单移除订单接口
export function removeAirTicketOrder(params) {
  return axios({
    url: '/api/airplane/airTicketBill/removeAirTicketOrder',
    method: 'post',
    data: params
  })
}
// 原始账单删除接口
export function deleteById(params) {
  return axios({
    url: '/api/airplane/airTicketBill/deleteById',
    method: 'get',
    params
  })
}
// 账单下所属订单分页列表接口
export function getBillAirTicektOrderPageByParam(params) {
  return axios({
    url: '/api/airplane/airTicketBill/getBillAirTicektOrderPageByParam',
    method: 'post',
    data: params
  })
}
// 保存服务商支付记录接口
export function billPayRecordSave(params) {
  return axios({
    url: '/api/airplane/billPayRecord/save',
    method: 'post',
    data: params
  })
}
