/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-07-06 11:07:06
 * @LastEditors: peng
 * @LastEditTime: 2021-08-26 15:30:30
 */
/**
 * 操作权限处理
 * Copyright (c) 2019 jeethink
 */

import store from '@/store'
import { getItem } from '@/utils/storage'

export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    const all_permission = '*:*:*'
    let permissions = []
    if (store.getters && store.getters.permissions.length) {
      permissions = store.getters && store.getters.permissions
    } else {
      permissions = JSON.parse(getItem('permissions'))
    }

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
