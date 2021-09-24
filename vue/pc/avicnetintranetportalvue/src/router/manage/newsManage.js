/*
 * @Descripttion: 资讯栏目管理
 * @Author: zongmz
 * @Date: 2021-03-22 13:49:12
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-08 16:59:41
 */
const Layout = () => import(/* webpackChunkName: "layout" */ '@/layouts/BasicLayout')
export default {
  alwaysShow: false,
  isShowParant: false,
  showTags: false,
  component: Layout,
  hidden: false,
  name: 'news-manage',
  path: '/news-manage',
  redirect: '/news-manage/content',
  meta: {
    icon: 'menu-addrbook',
    noCache: false,
    title: '资讯栏目管理'
  },
  children: [
    {
      hidden: false,
      isShowParant: false,
      showTags: false,
      meta: {
        icon: 'menu-toread',
        noCache: false,
        title: '内容管理',
        isSilder: true
      },
      name: 'content',
      path: '/news-manage/content',
      redirect: '/news-manage/content/content-list',
      component: () => import('@/view/management/news/content/index'),
      children: [
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '内容管理',
            isSilder: true
          },
          name: 'content-list',
          path: '/news-manage/content/content-list',
          component: () => import('@/view/management/news/content/content')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '新建内容',
            isSilder: true,
            routerType: 'add'
          },
          name: 'content-add',
          path: '/news-manage/content/content-add',
          component: () => import('@/view/management/news/content/content-operation')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '编辑内容',
            isSilder: true,
            routerType: 'edit'
          },
          name: 'content-edit',
          path: '/news-manage/content/content-edit',
          component: () => import('@/view/management/news/content/content-operation')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '内容详细',
            isSilder: true,
            routerType: 'view'
          },
          name: 'content-view',
          path: '/news-manage/content/content-view',
          component: () => import('@/view/management/news/content/content-operation')
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
        title: '栏目管理',
        isSilder: true
      },
      name: 'column',
      path: '/news-manage/column',
      redirect: '/news-manage/column/column-list',
      component: () => import('@/view/management/news/column/index'),
      children: [
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '栏目管理',
            isSilder: true
          },
          name: 'column-list',
          path: '/news-manage/column/column-list',
          component: () => import('@/view/management/news/column/column')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '新建栏目',
            isSilder: true,
            routerType: 'add'
          },
          name: 'column-add',
          path: '/news-manage/column/column-add',
          component: () => import('@/view/management/news/column/column-operation')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '编辑栏目',
            isSilder: true,
            routerType: 'edit'
          },
          name: 'column-edit',
          path: '/news-manage/column/column-edit',
          component: () => import('@/view/management/news/column/column-operation')
        },
        {
          hidden: true,
          isShowParant: false,
          showTags: false,
          meta: {
            icon: 'menu-toread',
            noCache: false,
            title: '栏目详细',
            isSilder: true,
            routerType: 'view'
          },
          name: 'column-view',
          path: '/news-manage/column/column-view',
          component: () => import('@/view/management/news/column/column-operation')
        }
      ]
    }
  ]
}
