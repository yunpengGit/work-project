/*
 * @Author: your name
 * @Date: 2020-11-12 14:59:33
 * @LastEditTime: 2021-02-01 10:51:26
 * @LastEditors: peng
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\pages\publicMailboxConfig\service.js
 */
import service from '../../api/request'

// 关联邮箱表格查询
export function selectPublicEmailByParam(params) {
	return service({
		url: `/api/email/selectPublicEmailByParam`,
		method: 'get',
		params
	})
}
// 关联邮箱添加
export function saveRelations(params) {
	return service({
		url: `/api/email/saveRelations`,
		method: 'post',
		data: params
	})
}
// 通过参数查询邮件组列表
export function selectAllEmailByParam(params) {
	return service({
		url: `/api/email/selectAllEmailByParam`,
		method: 'get',
		params
	})
}
// 查询企业所有员工的邮箱
export function getAllEmail(params) {
	return service({
		url: `/api/emailGroup/getAllEmail`,
		method: 'get',
		params
	})
}
// 公共邮箱地址获取关联邮箱分页
export function getMailLoginAccount(params) {
	return service({
		url: `/api/email/getMailLoginAccount`,
		method: 'get',
		params
	})
}
// 公共邮箱地址获取关联邮箱所有
export function getAllMailLoginAccount(params) {
	return service({
		url: `/api/email/getAllMailLoginAccount`,
		method: 'get',
		params
	})
}
// 删除公共邮箱关联人员
export function deleteMailLoginAccounts(params) {
	return service({
		url: `/api/email/${params.mailLoginAccountsIds}/deleteMailLoginAccounts`,
		method: 'put'
	})
}
// 公共邮箱创建
export function saveEmail(params) {
	return service({
		url: `/api/email/saveEmail`,
		method: 'post',
		data: params
	})
}
// 公共邮箱更新信息
export function updateAccountInfo(params) {
	return service({
		url: `/api/email/updateAccountInfo`,
		method: 'post',
		data: params
	})
}
// 公共邮箱密码更新
export function updateAccountPassword(params) {
	return service({
		url: `/api/email/updateAccountPassword`,
		method: 'post',
		data: params
	})
}
// 公共邮箱删除
export function deleteEmails(params) {
	return service({
		url: `/api/email/${params.emailsStr}/deleteEmails`,
		method: 'put',
		data: params
	})
}
// 公共邮箱删除
export function batchUpdateEmail(params) {
	return service({
		url: `/api/email/batchUpdateEmail`,
		method: 'put',
		data: params
	})
}
