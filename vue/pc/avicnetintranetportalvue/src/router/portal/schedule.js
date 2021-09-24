/*
 * @Descripttion: 日程管理
 * @Author: zongmz
 * @Date: 2021-04-15 14:54:58
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-08 16:58:38
 */
const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'schedule',
  path: '/schedule',
  redirect: '/schedule/list',
  meta: {
    icon: 'rili1',
    noCache: false,
    title: '日程'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'rili1',
        title: '日程管理',
        isSilder: true,
        noCache: false
      },
      name: 'list',
      path: 'list',
      component: () => import('@/view/schedule/eventManage')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'gongxiangbeifen',
        noCache: false,
        isSilder: true,
        title: '日程分享管理'
      },
      name: 'sharerList',
      path: 'sharerList',
      component: () => import('@/view/schedule/sharerList')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: true,
      meta: {
        icon: 'fujianbeifen',
        noCache: false,
        isSilder: false,
        title: '分享给我的'
      },
      name: 'orderList',
      path: 'orderList',
      component: () => import('@/view/schedule/sharerList')
    },
    // {
    //   hidden: false,
    //   isShowParant: false,
    //   showTags: true,
    //   meta: {
    //     icon: 'menu-todo',
    //     noCache: false,
    //     isSilder: false,
    //     title: '日程权限审批'
    //   },
    //   name: 'authConfirm',
    //   path: 'authConfirm',
    //   component: () => import('@/view/schedule/sharerList/authConfirm')
    // },
    {
      hidden: false,
      isShowParant: false,
      showTags: true,
      meta: {
        icon: 'quanbubeifen2',
        noCache: false,
        isSilder: false,
        title: '其他设置'
      },
      name: 'otherSetting',
      path: 'otherSetting',
      component: () => import('@/view/schedule/otherSetting')
    }
  ]
}
