/*
 * @Author: caofeng
 * @Date: 2021-07-13 15:38:09
 * @LastEditTime: 2021-08-30 14:47:28
 * @LastEditors: zhaohx
 * @Description: 接机送机相关页面路由
 * @FilePath: \conferenceH5\src\router\conference\pickAndSendTask.js
 */

export default [
  {
    path: '/airportTransfer/taskList',
    name: 'airportTransferTaskList',
    component: () => import('@conference/views/airportTransfer/taskList'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/airportTransfer/personInfo',
    name: 'airportTransferPersonInfo',
    component: () => import('@conference/views/airportTransfer/personInfo'),
    meta: {
      title: '应接人员信息',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/airportTransfer/taskDetail',
    name: 'airportTransferTaskDetail',
    component: () => import('@conference/views/airportTransfer/taskDetail'),
    meta: {
      title: '任务详情',
      keepAlive: false
    }
  }
]
