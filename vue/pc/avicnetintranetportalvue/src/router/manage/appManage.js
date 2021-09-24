/*
 * @Descripttion: 常用应用后台管理
 * @Author: zongmz
 * @Date: 2021-04-23 11:07:17
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-31 16:12:40
 */

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'appManage',
  path: '/appManage',
  redirect: '/appManage/oftenUseApp',
  meta: {
    icon: 'menu-addrbook',
    noCache: false,
    title: '常用业务管理'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '常用业务',
        isSilder: true
      },
      name: 'oftenUseApp',
      path: '/appManage/oftenUseApp',
      component: () => import('@/view/management/appManage/oftenUseApp')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '常用业务设置',
        isSilder: true
      },
      name: 'setOftenUseApp',
      path: '/appManage/setOftenUseApp',
      component: () => import('@/view/management/appManage/setOftenUseApp')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '图标管理',
        isSilder: true
      },
      name: 'iconManage',
      path: '/appManage/iconManage',
      component: () => import('@/view/management/appManage/iconManage')
    }
  ]
}
