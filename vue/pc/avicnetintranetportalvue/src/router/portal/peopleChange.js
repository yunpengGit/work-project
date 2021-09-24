/*
 * @Descripttion: 人员动态
 * @Author: zongmz
 * @Date: 2021-04-22 13:58:48
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-09 13:46:06
 */
const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'peoples',
  path: '/peopleChange',
  redirect: '/peopleChange/index',
  meta: {
    noCache: false,
    isSilder: false,
    title: '人员动态'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        title: '人员动态',
        isSilder: false,
        noCache: false
      },
      name: 'people',
      path: 'index',
      component: () => import('@/view/peopleChange/index')
    },
    {
      hidden: true,
      isShowParant: false,
      showTags: false,
      meta: {
        noCache: true,
        isSilder: true,
        title: '登记人员动态'
      },
      name: 'people-add',
      path: 'add',
      component: () => import('@/view/peopleChange/add')
    },
    {
      hidden: true,
      isShowParant: false,
      showTags: false,
      meta: {
        noCache: true,
        isSilder: false,
        title: '查看人员动态'
      },
      name: 'people-detail',
      path: 'detail',
      component: () => import('@/view/peopleChange/detail')
    }
  ]
}
