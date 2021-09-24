/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-29 15:58:42
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-05-07 10:28:01
 */
(function (win) {
  var tid
  function refreshRem () {
    const designSize = 1920 // 设计图尺寸
    const html = document.documentElement
    let wW = html.clientWidth// 窗口宽度
    if (wW < 1466) {
      wW = 1466
    }
    const rem = wW * 100 / designSize
    document.documentElement.style.fontSize = rem + 'px'
  }

  win.addEventListener('resize', function () {
    clearTimeout(tid)
    tid = setTimeout(refreshRem, 300)
  }, false)
  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      clearTimeout(tid)
      tid = setTimeout(refreshRem, 300)
    }
  }, false)

  refreshRem()
})(window)
