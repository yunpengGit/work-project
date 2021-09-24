/*
 * @Descripttion: 日程管理后台
 * @Author: zongmz
 * @Date: 2021-04-23 11:07:17
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-06 11:03:42
 */

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'scheduleManage',
  path: '/scheduleManage',
  redirect: '/scheduleManage/classification',
  meta: {
    icon: 'menu-addrbook',
    noCache: false,
    title: '日程管理'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '日程分类管理',
        isSilder: true
      },
      name: 'classification',
      path: '/scheduleManage/classification',
      component: () => import('@/view/scheduleManage/classification')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '分享权限管理',
        isSilder: true
      },
      name: 'sharePermission',
      path: '/scheduleManage/sharePermission',
      component: () => import('@/view/scheduleManage/sharePermission')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '日程数据查询',
        isSilder: true
      },
      name: 'dataQuery',
      path: '/scheduleManage/dataQuery',
      component: () => import('@/view/scheduleManage/dataQuery')
    }
  ]
}
