/**
 * Created by IntelliJ IDEA.
 * User: mengrv
 * DateTime: 2019/11/26 16:42
 * 服务商api
 */
import { http } from '@/http'

const ApiService = {
  // 服务商列表
  getServiceList (data) {
    return http({
      url: '/api/wsCompany/getCategoryCompanyList',
      method: 'get',
      data
    })
  }
}

export default ApiService
