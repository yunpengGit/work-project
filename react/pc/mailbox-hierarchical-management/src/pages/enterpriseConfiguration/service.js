/*
 * @Author: your name
 * @Date: 2020-12-06 18:31:21
 * @LastEditTime: 2020-12-11 09:44:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\enterpriseConfiguration\service.js
 */
import service from './../../api/request'

// 获取企业配置信息
export function selectCompanyConfigure(params) {
	return service({
		url: `/api/companyConfigure/${params.companyId}/selectCompanyConfigure`,
		method: 'get',
		params
	})
}
// 查询跟企业数据
export function selectCompanyConfiguresByParam(params) {
	return service({
		url: '/api/companyConfigure/selectCompanyConfiguresByParam',
		method: 'get',
		params
	})
}
// 查询根企业数据
export function selectRootOrgList(params) {
	return service({
		url: '/api/org/selectRootOrgList',
		method: 'get',
		params
	})
}
// 新增企业配置
export function saveCompanyConfigure(params) {
	return service({
		url: `/api/companyConfigure/saveCompanyConfigure`,
		method: 'post',
		data: params
	})
}
// 更新企业配置
export function updateCompanyConfigure(params) {
	return service({
		url: `/api/companyConfigure/updateCompanyConfigure`,
		method: 'post',
		data: params
	})
}
// 获取平台配置参数接口
export function getSystemParam(params) {
	return service({
		url: `/api/system/getSystemParam`,
		method: 'get',
	})
}
// 更新平台配置参数
export function updateSystemParam(params) {
	return service({
		url: `/api/system/updateSystemParam`,
		method: 'post',
		data: params
	})
}
// 获取平台默认配置最大值最小值
export function getCompanyLimitParam(params) {
	return service({
		url: `/api/companyConfigure/getCompanyLimitParam`,
		method: 'post',
		data: params
	})
}
// 新增企业扩容配置
export function saveCompanyDilatationConfigure(params) {
	return service({
		url: `/api/companyConfigure/saveCompanyDilatationConfigure`,
		method: 'post',
		data: params
	})
}
// 分页查询企业扩容配置
export function selectCompanyDilatationConfiguresByParam(params) {
	return service({
		url: `/api/companyConfigure/selectCompanyDilatationConfiguresByParam`,
		method: 'get',
		params
	})
}
// 更新企业扩容配置
export function updateCompanyDilatationConfigure(params) {
	return service({
		url: `/api/companyConfigure/updateCompanyDilatationConfigure`,
		method: 'post',
		data: params
	})
}
