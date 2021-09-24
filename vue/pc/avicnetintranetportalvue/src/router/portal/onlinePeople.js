/*
 * @Descripttion: 在线人员
 * @Author: zongmz
 * @Date: 2021-04-22 16:53:47
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-09 13:45:32
 */
const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'people-online',
  path: '/onlinePeople',
  redirect: '/onlinePeople/index',
  meta: {
    noCache: false,
    isSilder: false,
    title: '在线人员'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        title: '在线人员',
        isSilder: false,
        noCache: false
      },
      name: 'online',
      path: 'index',
      component: () => import('@/view/onlinePeople/index')
    }
  ]
}
