/*
 * @Author: your name
 * @Date: 2020-12-01 16:35:36
 * @LastEditTime: 2021-01-12 10:06:18
 * @LastEditors: peng
 * @Description: localStorage自定义方法,添加过期时间设置
 * @FilePath: \mailbox-hierarchical-management\src\utils\localStorageFn.js
 */
export const localStorageSet = (name, data, time) => {
  // time 毫秒
  const expire = new Date().getTime() + time
  const obj = {
    data,
    expire
  }
  localStorage.setItem(name, JSON.stringify(obj))
}
export const localStorageGet = (name) => {
  const storage = localStorage.getItem(name)
  const time = new Date().getTime()
  let result = null
  if (storage) {
    const obj = JSON.parse(storage)
    if (time < obj.expire) {
      result = obj.data
    } else {
      localStorage.removeItem(name)
    }
  }
  return result
}
