/*
 * @Description:
 * @Author: peng
 * @Date: 2021-07-26 13:44:38
 * @LastEditors: peng
 * @LastEditTime: 2021-07-29 14:57:16
 */
export default {
  data () {
    return {
      customizeList: ['CustomizeList', 'CustomizeNews'],
      iconDel: require('@/assets/home/customize/del.png'),
      iconUnEnable: require('@/assets/home/customize/unEnable.png'),
      iconUnAuth: require('@/assets/home/customize/unAuth.png')
    }
  },
  methods: {
    filterCustomize (arr) {
      const ids = []
      const arrMap = {} // 缓存 map 结构
      arr.forEach(e => {
        arrMap[e.componentId] = e
        if (this.customizeList.includes(e.componentName)) {
          ids.push(e.componentId)
        }
      })
      return new Promise((resolve, reject) => {
        if (ids.length !== 0) {
          this.$api('home.status', ids).then(res => {
            res.data.forEach(e => {
              if (arrMap[e.componentId]) {
                // console.log(e.status)
                arrMap[e.componentId].status = e.status
              }
            })
            // console.log(arr)
            resolve(arr)
          })
        } else {
          resolve(arr)
        }
      })
    },
    componentStatus (status) {
      // console.log(status)
      switch (status) {
        case 2:
          this.tipIcon = this.iconDel
          this.tipText = '该组件已被删除'
          break
        case 3:
          this.tipIcon = this.iconUnEnable
          this.tipText = '该组件已被停用'
          break
        case 4:
          this.tipIcon = this.iconUnAuth
          this.tipText = '您没有权限使用'
          break
        default:
          break
      }
    }
  }
}
