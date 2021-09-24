import { http } from '@/http'
const indexApi = {
  getSSOToken (data) {
    return http({
      url: '/api/wsToken/getH5Token',
      method: 'get',
      data
    })
  },
  getToken (data) {
    return http({
      url: '/api/wsToken/getToken',
      method: 'get',
      data
    })
  },
  getApproveTaskPage (data) {
    return http({
      url: '/api/wsNewApproval/getApproveTaskPage',
      method: 'get',
      data
    })
  },
  getPersonByPhone (data) {
    return http({
      url: '/api/ws/getPersonByPhone',
      method: 'get',
      data
    })
  },
  getIndexBanner (data) {
    return http({
      url: '/api/wsAdvertisment/getAdvertisment',
      method: 'get',
      data
    })
  },
  // 对接航信
  loginHx (data) {
    return http({
      url: '/api/wsTravelsky/loginHx',
      method: 'post',
      data
    })
  },
  // 对接携程
  loginXc (data) {
    return http({
      url: '/api/wsCtrip/loginXc',
      method: 'get',
      data
    })
  },
  // 对接首汽约车
  loginSq (data) {
    return http({
      url: '/api/wsShouQiYueChe/getShouQiYueCheUrl',
      method: 'get',
      data
    })
  },
  loginFiyta (data) {
    return http({
      url: '/api/wsUtil/fiytaUrl',
      method: 'get',
      data
    })
  },
  // 对接协议酒店
  getHrsHotel (data) {
    return http({
      url: '/api/wsHrsHotel/getHrsHotelSearchUrl',
      method: 'get',
      data
    })
  },
  // 首页轮播图埋点
  advertismentClickRecord (data) {
    return http({
      url: '/api/wsAdvertisment/advertismentClickRecord',
      method: 'get',
      data
    })
  },
  // 抢购页面
  getOmsUrl (data) {
    return http({
      url: '/api/wsUtil/getOmsUrl',
      method: 'get',
      data
    })
  }
}
export default indexApi
