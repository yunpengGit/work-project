/*
 * @Descripttion: compile axios path
 * @Author: zhaohx
 * @Date: 2021-06-26 01:03:13
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-06-26 18:44:09
 */
export const compile = url => {
  try {
    const path = url.split('.')
    const apiLink = path.pop()
    const pathOper = path.join('/')
    const module = require(`@/api/${pathOper}`)
    return {
      apiLink,
      module,
      options: module[apiLink]
    }
  } catch (e) {
    throw new Error(e)
  }
}
