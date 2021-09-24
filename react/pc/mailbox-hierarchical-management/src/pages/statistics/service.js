/*
 * @Author: your name
 * @Date: 2020-12-10 16:23:35
 * @LastEditTime: 2021-01-25 15:46:36
 * @LastEditors: peng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\statistics\seivece.js
 */
import service from '../../api/request'

// 查询组织机构下的所有邮箱账号的邮箱空间使用量，邮件使用量（分页）
export function queryMailUserByCompanyId(params) {
	return service({
		url: '/api/bigDataApi/queryMailUserByCompanyId',
		method: 'post',
		data: params
	})
}
// 查询组织机构下的所有邮箱账号的邮件收发量（分页）
export function queryMailUserSendAndRecvByCompanyId(params) {
	return service({
		url: '/api/bigDataApi/queryMailUserSendAndRecvByCompanyId',
		method: 'post',
		data: params
	})
}
// 查询一定时间段内企业邮件收发总量
export function queryMailOrgRcvSendCountTotal(params) {
	return service({
		url: '/api/bigDataApi/queryMailOrgRcvSendCountTotal',
		method: 'post',
		data: params
	})
}
// 查询一定时间段内企业邮件收发总量
export function queryMailInfoByCompanyId(params) {
	return service({
		url: '/api/bigDataApi/queryMailInfoByCompanyId',
		method: 'post',
		data: params
	})
}
