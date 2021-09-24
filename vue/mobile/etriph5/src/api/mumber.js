/**
 * Created by IntelliJ IDEA.
 * User: mengrv
 * DateTime: 2019/11/26 16:51
 * 人员相关api
 */
import { http } from '@/http'
const ApiMumber = {
  // 人员列表
  getPersonPage (data) {
    return http({
      url: '/api/wsDept/getPersonPage',
      method: 'get',
      data
    })
  }
}
export default ApiMumber
