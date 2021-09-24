/*
 * @Author: your name
 * @Date: 2020-12-06 18:31:21
 * @LastEditTime: 2021-06-24 18:19:20
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\enterpriseConfiguration\service.js
 */
import service from '../../api/request'

// 查询根企业数据
export function selectRootOrgList(params) {
	return service({
		url: '/api/org/selectRootOrgList',
		method: 'get',
		params
	})
}

// 获取企业域别名
export function selectCompanyDomainByParam(params) {
	return service({
		url: `/api/companyConfigure/selectCompanyDomainByParam`,
		method: 'get',
		params
	})
}

// 新增企业域别名
export function saveCompanyDomain (params) {
  return service({
    url: '/api/companyConfigure/saveCompanyDomain',
		method: 'post',
		data: params
  })
}
// 更新企业域别名
export function updateCompanyDomain (params) {
  return service({
    url: '/api/companyConfigure/updateCompanyDomain',
		method: 'post',
		data: params
  })
}
