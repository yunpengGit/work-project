/*
 * @Author: aq.hu
 * @Date: 2021-04-12 11:16:38
 * @LastEditTime: 2021-04-12 17:58:43
 * @LastEditors: aq.hu
 * @Description: 日志设置接口
 */
// 日志设置
export const logSetting = {
  url: '/system/operLogDump/queryLogDumpSetting',
  method: 'GET'
}
// 转储记录
export const logList = {
  url: '/system/operLogDump/list',
  method: 'GET'
}
// 日志转储
export const logDump = {
  url: '/system/operLogDump/logDump',
  method: 'POST'
}
