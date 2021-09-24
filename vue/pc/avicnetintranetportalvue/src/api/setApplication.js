/*
 * @Author: your name
 * @Date: 2021-03-22 09:52:38
 * @LastEditTime: 2021-06-06 21:43:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\api\setApplication.js
 */

// 已选的常用应用或业务  0应用 1业务
export const selectedWorkOrApp = {
  url: '/portal/rank/getUserConfigApplist/:type',
  method: 'GET'
}

// 授权业务列表
export const empowerWork = {
  url: '/portal/rank/userEmpowerBusinessList',
  method: 'GET'
}

// 授权应用列表
export const empowerApp = {
  url: '/portal/rank/userEmpowerAppList/v2',
  method: 'GET'
}

// 自定义应用列表
export const customApp = {
  url: '/portal/custom/listApp',
  method: 'GET'
}

// 自定义业务列表
export const customWork = {
  url: '/portal/custom/listResource',
  method: 'GET'
}

/*
 * 保存用户应用和业务
 * appOrResourceId
 * appOrResourceName
 * icon
 * url
 * type	0 应用 1业务
 * customFlag	0 非自定义 1自定义
*/
export const saveWorkOrApp = {
  url: '/portal/rank/rankApp',
  method: 'post'
}

/*
 * 新增自定义应用和业务
 * appOrResourceName	名称
 * type	0应用 1业务
 * icon	图标url
 * url	链接
 */
export const addCustom = {
  url: '/portal/custom/add',
  method: 'post'
}

/*
 * 编辑自定义应用和业务
 * appOrResourceName	名称
 * appOrResourceId
 * icon	图标url
 * url	链接
 */
export const editCustom = {
  url: '/portal/custom/edit',
  method: 'post'
}

/*
 * 删除自定义应用和业务
 * appOrResourceName	名称
 * appOrResourceId
 * icon	图标url
 * url	链接
 */
export const removeCustom = {
  url: '/portal/custom/remove/:id',
  method: 'get'
}

// 图标库
export const iconList = {
  url: '/portal/custom/iconList',
  method: 'get'
}
