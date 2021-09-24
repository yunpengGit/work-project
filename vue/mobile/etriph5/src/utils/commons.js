let _ = require('lodash')
export default {
  getScrollOffset () {
    /**
         * 获取页面滚动条距离-兼容写法
         */
    if (window.pageXOffset) {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    } else {
      return {
        x: document.body.scrollLeft || document.documentElement.scrollLeft,
        y: document.body.scrollTop || document.documentElement.scrollTop
      }
    }
  },

  getParams () {
    /**
         * 获取页面路径参数
         * @param flag
         */
    let search = location.search; let result = {}
    if (search.length) {
      let arr = search.substr(1).split('&')
      arr.forEach(s => {
        let t = s.split('=')
        result[t[0]] = decodeURI(t[1])
      })
    }
    return result
  },

  objectUrlToString (queryObj) {
    /**
         * 对象转为url字符串
         * @param {Object} queryObj 查询对象
         */
    let query = ''
    Object.keys(queryObj).forEach(key => {
      if (!_.isNil(queryObj[key])) { // isNil:是null或undefined
        query += `&${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`// 编码
      }
    })
    return '?' + query.slice(1)
  }
}
