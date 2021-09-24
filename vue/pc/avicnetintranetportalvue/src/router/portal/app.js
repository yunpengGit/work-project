/*
 * @Descripttion: 常用应用
 * @Author: zongmz
 * @Date: 2021-04-22 17:34:17
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-09 14:40:15
 */

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'app',
  path: '',
  redirect: '/setApplication',
  meta: {
    noCache: false,
    isSilder: false,
    title: '常用应用'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'pingtaiyingyong-hover',
        title: '常用应用',
        isSilder: false,
        noCache: false
      },
      name: 'set-app',
      path: 'setApplication',
      component: () => import('@/view/home/setApplication')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'changbanyewu-copy',
        title: '常办业务',
        isSilder: false,
        noCache: false
      },
      name: 'set-work',
      path: 'setWork',
      component: () => import('@/view/home/setWork')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'yingyongguanli',
        title: '应用管理',
        isSilder: false,
        noCache: false
      },
      name: 'manage-app-list',
      path: 'manage',
      component: () => import('@/view/home/manage')
    }
  ]
}
