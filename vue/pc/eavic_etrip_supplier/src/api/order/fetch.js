import { axios } from '../request'

// 分页查询携程订单抓取记录接口
export function getSupplierCtripGrabdataRecordListPageByParams(params) {
  return axios({
    url: '/api/airplane/ctripGrabdataRecord/getSupplierCtripGrabdataRecordListPageByParams',
    method: 'get',
    params
  })
}
// 抓取单公司携程订单结算数据 即手动获取
export function grabSingleCategoryCtripData(params) {
  return axios({
    url: '/api/airplane/airTicketOrder/grabSingleCategoryCtripData',
    method: 'get',
    params
  })
}
