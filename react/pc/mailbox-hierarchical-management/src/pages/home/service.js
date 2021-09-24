/*
 * @Author: your name
 * @Date: 2020-12-10 16:23:24
 * @LastEditTime: 2021-01-12 09:39:20
 * @LastEditors: peng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\home\service.js
 */
import service from './../../api/request'

// 根据企业id获取企业的邮箱使用情况（邮箱空间使用情况、邮件数量使用情况）
export function queryMailInfoByCompanyId(params) {
	return service({
		url: '/api/bigDataApi/queryMailInfoByCompanyId',
		method: 'post',
		data: params
	})
}
// 查询企业维度的邮件收发量（需要查询当前时间往前10天内的）
export function queryMailSendAndRecvByCompanyId(params) {
	return service({
		url: '/api/bigDataApi/queryMailSendAndRecvByCompanyId',
		method: 'post',
		data: params
	})
}
// 查询公司各状态邮箱数量
export function selectEmailCountByParam(params) {
	return service({
		url: '/api/email/selectEmailCountByParam',
		method: 'get',
		params
	})
}
// 查询公司扩容状态去重
export function selectCompanyDilatationConfigureByCompanyId(params) {
	return service({
		url: `/api/companyConfigure/${params.companyId}/selectCompanyDilatationConfigureByCompanyId`,
		method: 'get',
	})
}
// 查询公司扩容状态未去重
export function selectAllCompanyDilatationConfigure(params) {
	return service({
		url: `/api/companyConfigure/${params.companyId}/selectAllCompanyDilatationConfigure`,
		method: 'get',
	})
}
