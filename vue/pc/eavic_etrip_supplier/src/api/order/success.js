import { axios } from '../request'

// 订单模板下载接口
export function getSupplierTemplateList(params) {
  return axios({
    url: '/api/supplier/supplierTemplate/getSupplierTemplateList',
    method: 'get',
    params
  })
}
// 订单合并接口
export function validateAndUpdateMultiOrderOpenState(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/validateAndUpdateMultiOrderOpenState',
    method: 'get',
    params
  })
}
// 订单合并接口
export function mergeAirTicket(params) {
  return axios({
    url: '/api/airplane/airTicketBill/mergeAirTicket',
    method: 'post',
    data: params
  })
}
// 订单合并保存接口
export function save(params) {
  return axios({
    url: '/api/airplane/airTicketBill/save',
    method: 'post',
    data: params
  })
}
// 获取当前年对应的期数接口
export function getListBillPeriod(params) {
  return axios({
    url: '/api/airplane/airTicketBill/getListBillPeriod',
    method: 'get',
    params
  })
}
// 订单修改接口
export function update(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/update',
    method: 'post',
    data: params
  })
}
// 订单删除接口
export function deleteById(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/deleteById',
    method: 'post',
    params
  })
}
// 订单查询接口
export function getAirTicketOrderPageByParams(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/getAirTicketOrderPageByParams',
    method: 'post',
    data: params
  })
}
// 订单批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/deleteByIds',
    method: 'post',
    params
  })
}
// 订单行程查询接口
export function getSupplierAirTicketOrderListPageByParams(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/getSupplierAirTicketOrderListPageByParams',
    method: 'post',
    data: params
  })
}
// 单条订单行程详情接口
export function getSingleOrderByIdInSupplier(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/getSingleOrderByIdInSupplier',
    method: 'get',
    params
  })
}
