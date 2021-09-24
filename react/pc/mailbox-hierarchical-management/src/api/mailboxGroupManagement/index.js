/*
 * @Author: your name
 * @Date: 2020-11-09 17:39:32
 * @LastEditTime: 2020-12-23 15:07:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mailbox-hierarchical-management\src\api\mailboxGroupManagement\index.js
 */
import service from './../request'
// 新增邮件组
export function saveMailGroup (params) {
  return service({
    url: `/api/emailGroup/saveMailGroup`,
    method: 'post',
    data: params
  })
}
// 更新邮件组
export function updateMailGroup (params) {
  return service({
    url: `/api/emailGroup/updateMailGroup`,
    method: 'put',
    data: params
  })
}
// 添加邮件组成员
export function saveMailGroupMembers (params) {
  return service({
    url: `/api/emailGroup/saveMailGroupMembers`,
    method: 'post',
    data: params
  })
}
// 通过邮件组邮箱查询成员分页
export function getEmailGroupMember (params) {
  return service({
    url: `/api/emailGroup/getEmailGroupMember`,
    method: 'get',
    params
  })
}
// 通过邮件组邮箱查询成员所有
export function getAllEmailGroupMember (params) {
  return service({
    url: `/api/emailGroup/getAllEmailGroupMember`,
    method: 'get',
    params
  })
}
// 通过参数查询邮件组列表
export function selectEmailGroupByParam (params) {
  return service({
    url: `/api/emailGroup/selectEmailGroupByParam`,
    method: 'get',
    params
  })
}
// 通过参数查询邮件组列表
export function getAllEmail (params) {
  return service({
    url: `/api/emailGroup/getAllEmail`,
    method: 'get',
    params
  })
}
// 通过参数查询邮件组列表
export function selectAllEmailByParam (params) {
  return service({
    url: `/api/email/selectAllEmailByParam`,
    method: 'get',
    params
  })
}
// 删除邮件组成员
export function deleteMailGroupMembers (params) {
  return service({
    url: `/api/emailGroup/${params.mailGroupMemberIds}/deleteMailGroupMembers`,
    method: 'put',
    data: params
  })
}
// 删除邮件组
export function deleteMailGroup (params) {
  return service({
    url: `/api/emailGroup/${params.addressStr}/deleteMailGroup`,
    method: 'put',
    data: params
  })
}
// 删除邮件组
export function batchUpdateMailGroup (params) {
  return service({
    url: `/api/emailGroup/batchUpdateMailGroup`,
    method: 'put',
    data: params
  })
}
