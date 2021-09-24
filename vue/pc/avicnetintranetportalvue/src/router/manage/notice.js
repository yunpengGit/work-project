/*
 * @Descripttion: 通知公告后台管理
 * @Author: pengpeng
 * @Date: 2021-04-06 16:52:42
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-26 14:48:25
 */

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'notice-manage',
  path: '/notice-manage',
  redirect: '/notice-manage/content',
  meta: {
    icon: 'menu-addrbook',
    noCache: false,
    title: '通知公告'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '公告管理',
        isSilder: true
      },
      name: 'manage',
      path: '/notice-manage/content',
      redirect: '/notice-manage/content/list',
      component: () => import('@/view/management/notice/index'),
      children: [
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '公告列表',
            isSilder: true
          },
          name: 'manage-list',
          path: '/notice-manage/content/list',
          component: () => import('@/view/management/notice/list')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '公告详情',
            isSilder: true
          },
          name: 'manage-detail',
          path: '/notice-manage/content/detail',
          component: () => import('@/view/management/notice/detail')
        }
      ]
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '公告分类',
        isSilder: true
      },
      name: 'typesList',
      path: '/notice-manage/class/list',
      component: () => import('@/view/management/notice/typesList')
    }
  ]
}
