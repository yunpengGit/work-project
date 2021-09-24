/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-06-02 11:41:24
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-02 11:41:55
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this

    do {
      if (Element.prototype.matches.call(el, s)) return el
      el = el.parentElement || el.parentNode
    } while (el !== null && el.nodeType === 1)
    return null
  }
}
