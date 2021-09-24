/*
 * @Descripttion: 资讯栏目
 * @Author: zongmz
 * @Date: 2021-04-22 17:34:17
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-09 14:15:16
 */

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'information',
  path: '/information',
  redirect: '/information',
  meta: {
    noCache: false,
    isSilder: false,
    title: '资讯栏目'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'zonghexinxi1',
        title: '资讯栏目',
        isSilder: false,
        noCache: false
      },
      name: 'info-list',
      path: '/information/info-list',
      component: () => import('@/view/home/info')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        title: '资讯栏目订阅',
        icon: 'menu-shezhi',
        isSilder: false,
        noCache: false
      },
      name: 'info-subscribe',
      path: '/information/subscribe',
      component: () => import('@/view/home/info/subscribe')
    },
    {
      hidden: true,
      isShowParant: false,
      showTags: false,
      meta: {
        title: '详情',
        icon: 'menu-shezhi',
        isSilder: false,
        noCache: false
      },
      name: 'info-detail',
      path: '/information/detail',
      component: () => import('@/view/home/info/detail')
    }
  ]
}
