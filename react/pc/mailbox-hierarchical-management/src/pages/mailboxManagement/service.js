/*
 * @Author: your name
 * @Date: 2020-11-06 16:31:30
 * @LastEditTime: 2021-06-25 15:42:37
 * @LastEditors: pengpeng
 * @Description: In User Settings Edit
 */
import service from './../../api/request'

// 组织结构树
export function orgList (params) {
  return service({
    url: `/api/org/${params.id}/orgList`,
    method: 'get',
  })
}
// 通过节点查询当前节点下所有邮箱信息
export function selectEmailByParam (params) {
  return service({
    url: '/api/email/selectEmailByParam',
    method: 'get',
    params
  })
}

// 单导公司查询接口
export function selectMonoderivativeBase (params) {
  return service({
    url: '/api/email/selectMonoderivativeBase',
    method: 'get',
    params
  })
}

// 单导提交接口
export function saveMailMonoderivative (params) {
  return service({
    url: '/api/email/saveMailMonoderivative',
    method: 'post',
    data: params
  })
}
// 单导提交接口
export function selectApprovers (params) {
  return service({
    url: `/api/email/${params.email}/selectApprovers`,
    method: 'get'
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
    url: '/api/companyConfigur/updateCompanyDomain',
    method: 'post',
    data: params
  })
}
// 更新企业域别名
export function selectCompanyDomain (params) {
  return service({
    url: `/api/companyConfigure/${params.companyId}/selectCompanyDomain`,
    method: 'get',
  })
}
// 新增邮件审核人
export function saveApprovers (params) {
  return service({
    url: '/api/email/saveApprovers',
    method: 'post',
    data: params
  })
}
// 新增邮件别名
export function createAccountAlias (params) {
  return service({
    url: '/api/email/createAccountAlias',
    method: 'post',
    data: params
  })
}
// 更新邮件别名
export function updateAccountAlias (params) {
  return service({
    url: '/api/email/updateAccountAlias',
    method: 'post',
    data: params
  })
}
// 模板下载
export function emailAliasImportTemplateDownloadService (params) {
  return service({
		responseType: 'blob',
    url: '/api/download/excel/emailAliasImportTemplateDownloadService',
    method: 'get'
  })
}
// 导入邮箱别名
export function emailAliasImportService (params) {
  return service({
    url: '/api/uploadExcel/emailAliasImportService',
    method: 'post',
    data: params
  })
}

