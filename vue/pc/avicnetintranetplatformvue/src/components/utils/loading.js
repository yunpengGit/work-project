/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-22 15:22:13
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-22 15:22:37
 */
import { find, add, remove } from './set'
export default class {
  constructor (timeout) {
    this.switchContainer = []
    this.queue = {}
    this.timeout = timeout || 0
  }
  is (key) {
    return find(this.switchContainer, key)
  }
  open (key) {
    clearTimeout(this.queue[key])
    this.queue[key] = setTimeout(() => {
      add(this.switchContainer, key)
    }, this.timeout)
  }
  close (key) {
    clearTimeout(this.queue[key])
    remove(this.switchContainer, key)
  }
  closeAll () {
    Object.values(this.queue).forEach(v => {
      clearTimeout(v)
    })
    this.switchContainer = []
  }
}
