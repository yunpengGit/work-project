export default {
  install (Vue, options) {
    Vue.prototype.$isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`
    Vue.prototype.$formatDate = (value, format) => {
      let date = new Date(value)
      let y = date.getFullYear()
      let mm = date.getMonth() + 1
      mm = mm < 10 ? ('0' + mm) : mm
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      let week
      if (date.getDay() === 0) week = '星期日'
      if (date.getDay() === 1) week = '星期一'
      if (date.getDay() === 2) week = '星期二'
      if (date.getDay() === 3) week = '星期三'
      if (date.getDay() === 4) week = '星期四'
      if (date.getDay() === 5) week = '星期五'
      if (date.getDay() === 6) week = '星期六'
      let str
      if (format === 'yyyy年mm月dd日星期') {
        str = `${y}年${mm}月${d}日  ${week}`
      } else if (format === 'mm月dd日') {
        str = `${mm}月${d}日`
      } else if (format === 'mm月dd日星期') {
        str = `${mm}月${d}日  ${week}`
      } else if (format === 'yyyy-mm-dd HH:mm:ss') {
        str = `${y}-${mm}-${d} ${h}:${m}:${s}`
      } else if (format === 'yyyy-mm-dd') {
        str = `${y}-${mm}-${d}`
      }
      return str
    }
  }
}
