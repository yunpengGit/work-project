/**
 * Created by IntelliJ IDEA.
 * User: mengrv
 * DateTime: 2019/11/26 16:49
 * 部门相关api
 */
import { http } from '@/http'
const ApiDepartment = {
  // 部门列表
  getDeptPage (data) {
    return http({
      url: '/api/wsCategory/getDeptPage',
      method: 'get',
      data
    })
  }
}
export default ApiDepartment
