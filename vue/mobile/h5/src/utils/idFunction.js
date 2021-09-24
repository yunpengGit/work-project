/*
 * @Author: your name
 * @Date: 2020-10-19 20:57:08
 * @LastEditTime: 2020-10-19 22:19:50
 * @LastEditors: Please set LastEditors
 * @Description: 生成一个8位的随机id
 * @FilePath: \h5\src\utils\idFunction.js
 */
export default function idFunction () {
  const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const tmp = []
  let random
  for (let i = 0; i < 8; i++) {
    random = Math.floor(Math.random() * (str.length))
    if (tmp.indexOf(str[random]) === -1) {
      tmp.push(str[random])
    } else {
      i--
    }
  }
  return tmp.join('')
}
