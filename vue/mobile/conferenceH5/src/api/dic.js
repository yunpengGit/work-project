/*
 * @Descripttion:数据字典相关接口
 * @Author: zhaohx
 * @Date: 2021-07-24 21:33:35
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-30 17:41:16
 */
// 标签获取
export const getLabel = {
  url: '/conferenceTag/getList',
  method: 'GET'
}
// 获取性别
export const getSex = {
  url: '/dictionary/sex/dictionaryValue',
  method: 'GET'
}
// 获取职位级别
export const getLevel = {
  url: '/dictionary/positionLevel/dictionaryValue',
  method: 'GET'
}
// 获取证件类型
export const getCardType = {
  url: '/dictionary/cardType/dictionaryValue',
  method: 'GET'
}
// 获取民族
export const getNation = {
  url: '/dictionary/nation/dictionaryValue',
  method: 'GET'
}
// 获取颜色
export const getColors = {
  url: '/dictionary/vehicleColor/dictionaryValue',
  method: 'GET'
}
// 获取主题
export const getTheme = {
  url: '/dictionary/manualThemeCode/dictionaryValue',
  method: 'GET'
}
// 根据短链接获取真正链接
export const getLink = {
  url: '/baiduDwz/getLongUrl',
  method: 'GET'
}
// 获取行业
export const getTrade = {
  url: '/dictionary/conferenceType/dictionaryValue',
  method: 'GET'
}
// 获取会议组织
export const getOrganize = {
  url: '/dictionary/conferenceOrganizationType/dictionaryValue',
  method: 'GET'
}
