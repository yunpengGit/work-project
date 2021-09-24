/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-18 16:53:27
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-02 10:13:53
 */
const routeToNewTab = {
  methods: {
    routeToNewTab (value) {
      // value 为对象
      /*
      {
        path: '',
        url: '',
        query: {id: 12} // 传参数
      }
      */
      const type = Object.prototype.toString.call(value).match(/\[object (.*)\]/)[1]
      let data
      if (type === 'Object') {
        data = value
      } else if (type === 'String') { // 字符串则为路由地址
        data = {
          path: value
        }
      } else {
        throw new Error('路由跳转新页签，传参错误')
      }
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        const route = this.$router.resolve(data)
        window.open(route.href, '_blank')
      }
    }
  }
}
export default routeToNewTab
