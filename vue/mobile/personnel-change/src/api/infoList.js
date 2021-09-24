/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-05-25 15:41:38
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-02 14:27:30
 */
import { http } from './http'
const infoList = {
  getData (data) {
    return http({
      url: '/km/review/km_review_main/kmReviewQueryPersonnelDynamic.do?method=getData',
      method: 'get',
      data
    })
  }
}
export default infoList
