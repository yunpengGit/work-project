/*
 * @Descripttion: 领导一周安排
 * @Author: zongmz
 * @Date: 2021-04-19 16:22:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-11 10:06:31
 */

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'leaders',
  path: '/leadersWeekly',
  redirect: '/leadersWeekly/plans',
  meta: {
    noCache: false,
    isSilder: false,
    title: '领导一周安排'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-rili',
        title: '领导一周安排',
        isSilder: false,
        noCache: false
      },
      name: 'leader-plans',
      path: 'plans',
      component: () => import('@/view/leadersWeekly/plans')
    }
    // ,{
    //   hidden: false,
    //   isShowParant: false,
    //   showTags: true,
    //   meta: {
    //     icon: 'menu-shezhi',
    //     noCache: false,
    //     isSilder: false,
    //     title: '维护权限设置',
    //     roles: ['portal-in-leaderweek']
    //   },
    //   name: 'leader-permission',
    //   path: 'permission',
    //   component: () => import('@/view/leadersWeekly/permission')
    // }
  ]
}
