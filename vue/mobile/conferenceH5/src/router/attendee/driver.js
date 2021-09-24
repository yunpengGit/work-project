/*
 * @Description:
 * @Author: peng
 * @Date: 2021-07-12 09:52:48
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-23 14:09:27
 */

export const driverRouterMap = [
  {
    path: '/driver/tripTask',
    name: 'driverTripTask',
    component: () => import('@attendee/views/driver/tripTask/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '我的出车任务',
      keepAlive: false
    }
  },
  {
    path: '/driver/taskHistory',
    name: 'driverTaskHistory',
    component: () => import('@attendee/views/driver/taskHistory/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '历史任务',
      keepAlive: false
    }
  },
  {
    path: '/driver/taskDetail',
    name: 'driverTaskDetail',
    component: () => import('@attendee/views/driver/taskDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车详情',
      keepAlive: false
    }
  }
]
