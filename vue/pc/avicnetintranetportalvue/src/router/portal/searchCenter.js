export default {
  path: '/searchCenter',
  redirect: '',
  meta: {
    title: '搜索中心',
    hidden: true
  },
  component: () => import('@/layouts/RouteView'),
  children: [{
    path: '',
    meta: {
      title: '搜索中心'
    },
    component: () => import('@/view/searchCenter')
  }
  ]
}

