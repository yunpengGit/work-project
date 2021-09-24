/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-23 15:19:05
 * @LastEditors: peng
 * @LastEditTime: 2021-07-26 16:42:51
 */
export const siteUserList = {
  // baseURL: '/mock',
  url: '/portal/site/user/list',
  method: 'GET'
}
export const scrollNews = {
  baseURL: '/mock',
  url: '/portal/info/fa',
  method: 'GET'
}
export const todoCount = {
  // baseURL: '/mock',
  url: '/portal/todo/user/count',
  method: 'GET'
}
export const dictionaryFilter = {
  // baseURL: '/mock',
  url: '/portal/todo/dictionary/business',
  method: 'GET'
}
export const todoList = {
  // baseURL: '/mock',
  url: '/portal/todo/user/list',
  method: 'GET'
}
export const todoHide = {
  // baseURL: '/mock',
  url: '/portal/todo/:todoUserId/showState/:showType',
  method: 'POST'
}
export const readAll = {
  // baseURL: '/mock',
  url: '/portal/todo/readAll',
  method: 'POST'
}
export const read = {
  // baseURL: '/mock',
  url: 'portal/todo/read/:todoUserId',
  method: 'POST'
}
export const todoListShowState = {
  // baseURL: '/mock',
  url: '/portal/:todoUserId/showState/:showType',
  method: 'POST'
}

export const careWorkList = {
  // baseURL: '/mock',
  url: '/portal/carework/user/list',
  method: 'GET'
}

export const cancelCareWork = {
  // baseURL: '/mock',
  url: '/portal/carework/:careWorkId/cancel',
  method: 'GET'
}

export const dateAsDimension = {
  // baseURL: '/mock',
  url: '/portal/schedule/user/events/get/dateAsDimension',
  method: 'POST'
}

export const noticeList = {
  // baseURL: '/mock',
  url: '/portal/notice/view/list',
  method: 'GET'
}

export const subscribeList = {
  // baseURL: '/mock',
  url: '/portal/cms/user/home/contents',
  method: 'GET'
}
export const subscribeContentsList = {
  // baseURL: '/mock',
  url: '/portal/cms/user/subscribed/contents',
  method: 'GET'
}
export const subscribingInfo = {
  // baseURL: '/mock',
  url: '/portal/cms/user/catalogs/subscribingInfo',
  method: 'GET'
}
export const subscribeSave = {
  // baseURL: '/mock',
  url: '/portal/cms/user/catalogs/subscribe',
  method: 'POST'
}
export const downloadByBusId = {
  // baseURL: '/mock',
  url: '/file/info/downloadByBusId/:busId',
  method: 'GET'
}

export const mailList = {
  // baseURL: '/mock',
  url: '/portal/mail/user/list',
  method: 'GET'
}
export const updateMailStatus = {
  // baseURL: '/mock',
  url: '/portal/mail/user/updateMailStatus',
  method: 'POST'
}

export const getUserRankList = {
  // baseURL: '/mock',
  url: '/portal/rank/getUserRanklist/:type',
  method: 'GET'
}
export const rankApp = {
  // baseURL: '/mock',
  url: '/portal/rank/rankApp/order',
  // timeout: '10000',
  method: 'POST'
}
export const manageList = {
  // baseURL: '/mock',
  url: '/portal/app/manage/user/list',
  method: 'GET'
}
export const pageDetail = {
  // baseURL: '/mock',
  url: 'portal/page/:pageId/detail',
  method: 'GET'
}
export const status = {
  // baseURL: '/mock',
  url: '/portal/component/status',
  method: 'POST'
}

