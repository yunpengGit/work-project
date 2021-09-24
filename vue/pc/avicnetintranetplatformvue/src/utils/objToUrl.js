/*
 * @Author: zongmingzhu
 * @Date: 2021-01-27 14:19:49
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-03-01 10:43:07
 */

/**
 * 对象转URL参数
 * @param param // 将要转为URL参数字符串的对象
 * @param key // URL参数字符串的前缀
 * @param encode // 是否进行URL编码,默认为true
 * @returns {String}
 */

export default function urlEncode (param, key, encode) {
  if (param == null) return ''
  var paramStr = ''
  var t = typeof param
  if (t === String || t === Number || t === Boolean) {
    paramStr +=
      '&' +
      key +
      '=' +
      (encode === null || encode ? encodeURIComponent(param) : param)
  } else {
    for (var i in param) {
      var k =
        key === null
          ? i
          : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr
}
