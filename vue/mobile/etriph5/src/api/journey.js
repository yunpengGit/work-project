/**
 * Created by IntelliJ IDEA.
 * User: mengrv
 * DateTime: 2019/11/26 16:42
 * 行程相关api
 */
import { http } from '@/http'

const ApiJourney = {
  // 行程记录列表
  journeyList (data) {
    return http({
      url: '/api/wsJourney/getList',
      method: 'get',
      data
    })
  },
  // 行程取消
  cancelJourney (data) {
    return http({
      url: '/api/wsJourney/confirmJourneyQX',
      method: 'get',
      data
    })
  },
  // 批量取消行程
  batchCancelJourney (data) {
    return http({
      url: '/api/wsJourney/batchConfirmJourneyQX',
      method: 'get',
      data
    })
  },
  // 行程确认
  confirmJourney (data) {
    return http({
      url: '/api/wsJourney/confirmJourney',
      method: 'get',
      data
    })
  },
  // 批量行程确认
  batchConfirmJourney (data) {
    return http({
      url: '/api/wsJourney/batchConfirmJourney',
      method: 'get',
      data
    })
  },
  // 批量下载行程
  batchConfirmationForMobilePhone (data) {
    return http({
      url: '/api/wsJourney/batchConfirmationForMobilePhone',
      method: 'get',
      data
    })
  },
  // 行程记录详情
  journeyDetail (data) {
    return http({
      url: '/api/wsJourney/getJourney',
      method: 'get',
      data
    })
  },
  // 行程记录详情订单列表
  orderlist (data) {
    return http({
      url: '/api/wsOrderlist/getList',
      method: 'get',
      data
    })
  },
  // 行程记录详情订单详情
  orderModel (data) {
    return http({
      url: '/api/wsOrderlist/getOrderModel',
      method: 'get',
      data
    })
  },
  // 行程详情现在确认函
  confirmationForMobilePhone (data) {
    return http({
      url: '/api/wsJourney/confirmationForMobilePhone',
      method: 'get',
      data
    })
  },
  // 获取成本中心列表
  getCostCenterList (data) {
    return http({
      url: '/api/wsCostCenter/getCostCenterList',
      method: 'get',
      data
    })
  },
  // 修改成本中心字段
  changeCost (data) {
    return http({
      url: '/api/wsJourney/changeCost',
      method: 'post',
      data
    })
  }
}

export default ApiJourney
