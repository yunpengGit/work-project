/*
 * @Author: your name
 * @Date: 2021-07-19 15:58:46
 * @LastEditTime: 2021-08-26 14:10:34
 * @LastEditors: zongmz
 * @Description: In User Settings Edit
 * @FilePath: \conferenceH5e:\项目\内网\avicnetintranetplatformvue\src\api\componentManage.js
 */
// 获取组件分类列表
export const listCategory = {
  url: '/portal/component/category/list',
  method: 'GET'
}

// 新增业务分类
export const addCategory = {
  url: '/portal/component/category/add',
  method: 'POST'
}

// 删除业务分类
export const deleteCategory = {
  url: '/portal/component/category/:categoryId/delete',
  method: 'POST'
}

// 修改业务分类
export const updateCategory = {
  url: '/portal/component/category/update',
  method: 'POST'
}

// 停启用业务分类
export const changeStateCategory = {
  url: '/portal/component/category/:categoryId/changeState/:enableStatus',
  method: 'POST'
}

// 获取组件列表 -- 分页展示
export const listComponentPage = {
  url: '/portal/component/list',
  method: 'GET'
}

// 获取组件列表 -- 分类展示
export const listComponentCategory = {
  url: '/portal/component/list/category',
  method: 'GET'
}

// 新增组件
export const addComponent = {
  url: '/portal/component/add',
  method: 'POST'
}

// 修改组件
export const updateComponent = {
  url: '/portal/component/update',
  method: 'POST'
}

// 组件授权
export const authComponent = {
  url: '/portal/component/:componentId/auth',
  method: 'POST'
}

// 删除组件
export const deleteComponent = {
  url: '/portal/component/:componentId/delete',
  method: 'POST'
}

// 停启用组件
export const enableStatusComponent = {
  url: '/portal/component/:componentId/changeStatus/:enableStatus',
  method: 'POST'
}

// 组件详情
export const detailComponent = {
  url: '/portal/component/:componentId/detail',
  method: 'GET'
}

// 调用后台服务测试第三方接口
export const requestExec = {
  url: '/portal/component/request/exec',
  method: 'POST'
}
