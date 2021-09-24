/*
 * @Descripttion: 模板列表
 * @Author: zongmz
 * @Date: 2021-05-30 15:54:03
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-30 16:41:43
 */
const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'template',
  path: '/template',
  redirect: '/template/index',
  meta: {
    icon: 'menu-todo',
    noCache: false,
    isSilder: true,
    title: '模板列表'
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
        title: '模板列表'
      },
      name: 'template_index',
      path: 'index',
      component: () => import('@/view/temList/index')
    }
  ]
}
