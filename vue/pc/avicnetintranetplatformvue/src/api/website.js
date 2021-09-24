/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-06-06 11:35:47
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-09 18:52:21
 */

/**
 * @name:webSiteList
 * @msg:查询站点列表
 * @param {*}
 * @return {*}
 */
export const webSiteList = {
  url: '/portal/site/list',
  method: 'GET'
}

/**
 * @name:webSiteAdd
 * @msg:新增站点
 * @param {siteName}
 * @param {siteImageUrl}
 * @return {*}
 */
export const webSiteAdd = {
  url: '/portal/site/add',
  method: 'POST'
}

/**
 * @name:webSiteUpdate
 * @msg:编辑站点
 * @param {siteId}
 * @param {siteName}
 * @param {siteImageUrl}
 * @return {*}
 */
export const webSiteUpdate = {
  url: '/portal/site/update',
  method: 'POST'
}

/**
 * @name:webSiteDel
 * @msg:删除站点
 * @param {siteId}
 * @return {*}
 */
export const webSiteDel = {
  url: '/portal/site/:siteId/delete',
  method: 'POST'
}

/**
 * @name:webSiteAuth
 * @msg:授权站点
 * @param {siteId}
 * @return {*}
 */
export const webSiteAuth = {
  url: '/portal/site/:siteId/auth',
  method: 'POST'
}

/**
 * @name:pageAuth
 * @msg:授权站点
 * @param {siteId}
 * @return {*}
 */
export const pageAuth = {
  url: '/portal/page/:pageId/auth',
  method: 'POST'
}
/**
 * @name:webSitePageList
 * @msg:查询站点页面
 * @param {siteId}
 * @return {*}
 */
export const webSitePageList = {
//   baseURL: '/mock',
  url: '/portal/page/:siteId/list',
  method: 'GET'
}

/**
 * @name:pagePublish
 * @msg:发布页面
 * @param {pageId}
 * @return {*}
 */
export const pagePublish = {
  // baseURL: '/mock',
  url: '/portal/page/:pageId/publish',
  method: 'POST'
}

/**
 * @name:pageDelete
 * @msg:删除页面
 * @param {siteId}
 * @return {*}
 */
export const pageDelete = {
//   baseURL: '/mock',
  url: '/portal/page/:pageId/delete',
  emulateJSON: true,
  method: 'POST'
}

/**
 * @name:pageOrder
 * @msg:排序页面
 * @param {siteId}
 * @return {*}
 */
export const pageOrder = {
  //   baseURL: '/mock',
  url: '/portal/page/order',
  method: 'POST'
}
