/*
 * @Descripttion:通讯录后台
 * @Author: zongmz
 * @Date: 2021-04-23 11:07:17
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-08 16:58:29
 */

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'management-addrbook',
  path: '/management-addrbook',
  redirect: '/management-addrbook/staff',
  meta: {
    noCache: false,
    isSilder: false,
    title: '通讯录',
    icon: 'menu-addrbook'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        title: '员工管理',
        isSilder: false,
        noCache: false,
        icon: 'menu-addrbook'
      },
      name: 'addrbook-staff',
      path: '/management-addrbook/staff',
      component: () => import('@/view/management/addrbook/staff')
    },
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        title: '隐私管理',
        isSilder: false,
        noCache: false,
        icon: 'menu-addrbook'
      },
      name: 'addrbook-privacy',
      path: '/management-addrbook/privacy',
      component: () => import('@/view/management/addrbook/privacy')
    }
  ]
}

//   children: [
//     {
//       path: 'staff',
//       meta: { title: '员工管理', isSilder: true, isBreadcrumb: true },
//       component: () => import('@/view/management/addrbook/staff')
//     },
//     {
//       path: 'privacy',
//       meta: { title: '隐私管理', isSilder: true, isBreadcrumb: true },
//       component: () => import('@/view/management/addrbook/privacy')
//     }
//   ]
// }
