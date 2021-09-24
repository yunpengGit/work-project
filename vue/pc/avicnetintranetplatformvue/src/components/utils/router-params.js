/*
 * @Author: zongmingzhu@avic.com
 * @Date: 2021-01-18 20:15:31
 * @Last Modified by: zongmingzhu
 * @Last Modified time: 2021-01-19 10:24:21
 */

const rules = {}

export const parse = (type, uid, params) => {
  for (const i in params) {
    if (`${type}.${uid}` === i) {
      return rules[type].parse(params[i])
    }
  }
  return null
}

export const componentization = (type, uid, params) => {
  return {
    [`${type}.${uid}`]: rules[type].componentization(params)
  }
}

export const addRule = (type, rule) => {
  rules[type] = rule
}

export default class {
  constructor (type, uid) {
    this.type = type
    this.uid = uid || 0
  }

  parse (params) {
    return parse(this.type, this.uid, params)
  }

  componentization (params) {
    return componentization(this.type, this.uid, params)
  }
}
