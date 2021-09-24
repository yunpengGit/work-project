import { http } from '@/http'
// const BASE_URL = 'http://tgycvi.natappfree.cc'
// const BASE_URL = '/api'
const BASE_URL = ''
const handleApi = {
  groupLeaderCirculateInit (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_lader/kmImissiveLader.do?method=getLaders',
      method: 'get',
      data
    })
  },
  ownDepartmentSearch (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=searchOrg',
      method: 'get',
      data
    })
  },
  ownDepartmentCirculateInit (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getOrg',
      method: 'get',
      data
    })
  },
  ownDepartmentHandleInit (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getOrg',
      method: 'get',
      data
    })
  },
  // 综管部领导阅示（本部门办理人）
  ownIMISLeaderCirculateInit (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getBackOrg&nodetype=groupAllTube',
      method: 'get',
      data
    })
  },
  // 办结审批人
  groupHostSettleApprover (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getBackOrg&nodetype=groupOther2',
      method: 'get',
      data
    })
  },
  groupTransactorSettleApprover (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getBackOrg&nodetype=groupOther1',
      method: 'get',
      data
    })
  },
  // 本部门领导（本部门办理人）
  ownLeaderInit (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getLeaderOrg',
      method: 'get',
      data
    })
  },
  otherDepartmentCirculateInit (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getStaffs',
      method: 'get',
      data
    })
  },
  otherDepartmentHandleInit (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getStaffs',
      method: 'get',
      data
    })
  },
  getHistoryHandler (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getHistoryHandler&nodeType=groupHost',
      method: 'get',
      data
    })
  },
  getUsages (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getUsages',
      method: 'get',
      data
    })
  },
  // 子公司
  // 组织架构获取 其他部门办理其他部门阅示
  subsidiaryOrganizationStructure (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getAllOrg',
      method: 'get',
      data
    })
  },
  // 公司领导获取
  companyLeader (data) {
    return http({
      url: BASE_URL + '/km/imissive/km_company_lader/kmCompanyLader.do?method=getCompanys',
      method: 'get',
      data
    })
  }
}
export default handleApi
