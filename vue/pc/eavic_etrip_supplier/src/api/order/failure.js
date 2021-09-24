import { axios } from '../request'

// 订单修改接口
export function update(params) {
  return axios({
    url: '/api/airplane/airTicketUnfinishedOrder/update',
    method: 'post',
    data: params
  })
}
// 订单修正接口
export function correctOne(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/correctOne',
    method: 'post',
    params
  })
}
// 订单批量修正接口
export function correct(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/correct',
    method: 'post',
    params
  })
}
// 查询结果修正修正接口
export function queryResultBatchCorrectTask(params) {
  return axios({
    url: '/api/airplane/airTicketUnfinishedOrder/queryResultBatchCorrectTask',
    method: 'post',
    data: params
  })
}
// 订单保存并修正接口
export function updateAndCorrectOneUnfinishedOrder(params) {
  return axios({
    url: '/api/airplane/airTicketUnfinishedOrder/updateAndCorrectOneUnfinishedOrder',
    method: 'post',
    data: params
  })
}
// 订单删除接口
export function deleteById(params) {
  return axios({
    url: '/api/airplane/airTicketUnfinishedOrder/deleteById',
    method: 'post',
    params
  })
}
// 订单批量删除接口
export function deleteByIds(params) {
  return axios({
    url: '/api/airplane/airTicketUnfinishedOrder/deleteByIds',
    method: 'post',
    params
  })
}
// 订单分页查询接口
export function getSupplierAirTicketUnfinishedOrderListPageByParams(params) {
  return axios({
    url: '/api/airplane/airTicketUnfinishedOrder/getSupplierAirTicketUnfinishedOrderListPageByParams',
    method: 'post',
    data: params
  })
}
// 单条订单行程详情接口
export function getSingleUnfinishedOrderByIdInSupplier(params) {
  return axios({
    url: '/api/airplane/airTicketUnfinishedOrder/getSingleUnfinishedOrderByIdInSupplier',
    method: 'get',
    params
  })
}
