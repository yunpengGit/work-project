/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: peng
 * @LastEditTime: 2021-07-07 17:09:15
 */
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/home',
    name: 'home',
    alias: '/',
    component: () => import('@driver/views/home/index'),
    meta: {
      title: '首页',
      keepAlive: false
    }
  },
  {
    path: '/tripTask',
    name: 'tripTask',
    alias: '/',
    component: () => import('@driver/views/tripTask/index'),
    meta: {
      title: '我的出现任务',
      keepAlive: false
    }
  },
  {
    path: '/taskHistory',
    name: 'taskHistory',
    alias: '/',
    component: () => import('@driver/views/taskHistory/index'),
    meta: {
      title: '历史任务',
      keepAlive: false
    }
  },
  {
    path: '/taskDetail',
    name: 'taskDetail',
    alias: '/',
    component: () => import('@driver/views/taskDetail/index'),
    meta: {
      title: '用车详情',
      keepAlive: false
    }
  }
]
