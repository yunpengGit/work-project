/*
 * @Descripttion: 待办待阅
 * @Author: zongmz
 * @Date: 2021-04-15 14:54:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-26 18:04:54
 */
const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'doAndRead',
  path: '/doAndRead',
  redirect: '/doAndRead/toDo',
  meta: {
    icon: 'menu-todo',
    noCache: false,
    isSilder: true,
    title: '代办待阅'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-todo',
        noCache: false,
        isSilder: true,
        title: '待办',
        type: 1
      },
      name: 'toDo',
      path: 'toDo',
      component: () => import('@/view/doAndRead/index')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '待阅',
        isSilder: true,
        type: 3
      },
      name: 'toRead',
      path: 'toRead',
      component: () => import('@/view/doAndRead/index')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-done',
        noCache: false,
        isSilder: true,
        title: '已办',
        type: 5 // 2
      },
      name: 'done',
      path: 'done',
      component: () => import('@/view/doAndRead/index')
    }
    // ,{
    //   hidden: false,
    //   isShowParant: false,
    //   showTags: false,
    //   meta: {
    //     icon: 'menu-known',
    //     noCache: false,
    //     isSilder: true,
    //     title: '已阅事项',
    //     type: 4
    //   },
    //   name: 'known',
    //   path: 'known',
    //   component: () => import('@/view/doAndRead/index')
    // }
  ]
}
