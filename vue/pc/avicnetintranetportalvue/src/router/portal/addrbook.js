/*
 * @Descripttion: 通讯录
 * @Author: zongmz
 * @Date: 2021-04-15 14:54:58
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-09 13:48:20
 */

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'book',
  path: '/addrbook',
  redirect: '/addrbook/index',
  meta: {
    noCache: false,
    isSilder: false,
    title: '通讯录'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-addrbook',
        title: '通讯录',
        isSilder: false,
        noCache: false
      },
      name: 'addrbook',
      path: 'index',
      component: () => import('@/view/phoneBook')
    }
  ]
}
