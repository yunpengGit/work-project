/*
 * @Author: aq.hu
 * @Date: 2021-04-01 14:34:39
 * @LastEditTime: 2021-04-09 15:29:45
 * @LastEditors: aq.hu
 * @Description: 企业管理接口
 */
// 懒加载企业树
export const orgTree = {
  url: '/system/enterprise/lazyTree',
  method: 'GET'
}
// 查询企业列表
export const orgList = {
  url: '/system/enterprise/list',
  method: 'GET'
}
// 根据名称查询企业树
export const nameDepts = {
  url: '/system/enterprise/cascadeTree',
  method: 'GET'
}
// 添加企业
export const addOrg = {
  url: '/system/enterprise/add',
  method: 'POST'
}
// 删除企业
export const cancelOrg = {
  url: '/system/enterprise/remove',
  method: 'POST'
}
// 查询企业详情
export const orgDetail = {
  url: '/system/dept/:id',
  method: 'GET'
}
// 编辑企业
export const editOrg = {
  url: '/system/enterprise/edit',
  method: 'POST'
}
