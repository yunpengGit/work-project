/*
 * @Author: zongmingzhu
 * @Date: 2021-01-27 14:34:25
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-02-03 13:35:52
 */

/**
 * 日期格式化
 * @param date // 时间戳
 * @param fmt // 格式化规则 yyyy-MM-dd hh:mm:ss
 * @returns {String}
 */

export default function (date, fmt) {
  // 修复 浏览器时间 NaN 问题
  // 当date为字符串是处理格式问题
  if (Object.prototype.toString.call(date) === '[object String]') {
    date = date.replace(/-/gm, '/')
  }
  if (!date) {
    return ''
  }
  if (!fmt) {
    fmt = 'yyyy-MM-dd'
  }
  if (date.length < 13) {
    date = date * 1000
  }
  date = new Date(date)
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  var week = {
    0: '/u65e5',
    1: '/u4e00',
    2: '/u4e8c',
    3: '/u4e09',
    4: '/u56db',
    5: '/u4e94',
    6: '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '/u661f/u671f'
          : '/u5468'
        : '') + week[date.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
