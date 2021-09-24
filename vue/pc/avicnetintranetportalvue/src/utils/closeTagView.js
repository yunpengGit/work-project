/*
 * @Descripttion: 删除无用路由标签
 * @Author: zongmz
 * @Date: 2021-04-21 17:47:33
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-21 18:18:50
 */
import store from '@/store'
import Router from '@/router'
const vm = Router.app
export const closeTagView = {
  closeTag: function (view) {
    store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
      if (view.path === vm.$route.path) {
        this.toLastView(visitedViews, view)
      }
    })
  },
  toLastView: function (visitedViews, view) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
      vm.$router.push(latestView.fullPath)
    } else {
      if (view.name === 'Dashboard') {
        vm.$router.replace({ path: '/redirect' + view.fullPath })
      } else {
        vm.$router.push('/')
      }
    }
  }
}
