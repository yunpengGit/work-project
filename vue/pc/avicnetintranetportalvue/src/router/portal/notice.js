/*
 * @Descripttion:通知公告
 * @Author: zongmz
 * @Date: 2021-04-15 14:54:58
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-30 18:41:17
 */
const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'notice',
  path: '/notice',
  redirect: '/notice/myStart',
  meta: {
    icon: 'menu-notice',
    noCache: false,
    title: '通知公告'
  },
  children: [
    // {
    //   hidden: false,
    //   isShowParant: false,
    //   showTags: false,
    //   meta: {
    //     icon: 'menu-todo',
    //     title: '我可见的',
    //     isSilder: true,
    //     noCache: false
    //   },
    //   name: 'mySee',
    //   path: '/notice/mySee',
    //   component: () => import('@/view/notice/mySee')
    // },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-notice',
        noCache: false,
        isSilder: true,
        title: '通知公告',
        type: 1
      },
      name: 'myStart',
      path: '/notice/myStart',
      redirect: '/notice/myStart/list',
      component: () => import('@/view/notice/index'),
      children: [
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-todo',
            noCache: false,
            isSilder: false,
            title: '公告列表'
          },
          name: 'myStart-list',
          path: '/notice/myStart/list',
          component: () => import('@/view/notice/myStart')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-todo',
            noCache: true,
            isSilder: false,
            title: '新建公告'
          },
          name: 'addNotice',
          path: '/notice/myStart/addNotice',
          component: () => import('@/view/notice/addEditNotice')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-todo',
            noCache: true,
            isSilder: false,
            title: '编辑公告'
          },
          name: 'editNotice',
          path: '/notice/myStart/editNotice',
          component: () => import('@/view/notice/addEditNotice')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-todo',
            noCache: false,
            isSilder: false,
            title: '查看公告'
          },
          name: 'details',
          path: '/notice/myStart/detail',
          component: () => import('@/view/notice/detail')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-todo',
            noCache: false,
            isSilder: false,
            title: '查看公告'
          },
          name: 'detail',
          path: '/notice/detail',
          component: () => import('@/view/notice/detail')
        }
      ]
    }
  ]
}
