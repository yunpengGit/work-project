/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: zongmz
 * @LastEditTime: 2021-07-23 14:19:28
 */
/**
 * 基础路由
 * @type { *[] }
 */
import { driverRouterMap } from './driver'
export const constantRouterMap = [
  ...driverRouterMap,
  {
    path: '/login',
    name: 'login',
    component: () => import('@attendee/views/login/index'),
    meta: {
      title: '登录',
      keepAlive: false,
      // 不需要登录验证的组件
      isNoAuth: true
    }
  },
  {
    path: '/webLogin',
    name: 'webLogin',
    component: () => import('@attendee/views/webLogin/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议活动登录',
      keepAlive: false,
      // 不需要登录验证的组件
      isNoAuth: true
    }
  },
  {
    path: '/codeJump',
    name: 'codeJump',
    component: () => import('@attendee/views/codeJump/index'),
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/pageJump',
    name: 'pageJump',
    component: () => import('@attendee/views/pageJump/index'),
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/invitation',
    name: 'invitation',
    component: () => import('@attendee/views/invitation/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '邀请函',
      keepAlive: false
    }
  },
  {
    path: '/home',
    name: 'home',
    alias: '/',
    component: () => import('@attendee/views/home/index'),
    meta: {
      title: '首页',
      keepAlive: false
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@attendee/views/search/index'),
    meta: {
      title: '搜索页',
      keepAlive: false
    }
  },
  {
    path: '/searchList',
    name: 'searchList',
    component: () => import('@attendee/views/searchList/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '搜索结果页',
      keepAlive: false
    }
  },
  {
    path: '/conferenceHomePage',
    name: 'conferenceHomePage',
    component: () => import('@attendee/views/conferenceHomePage/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议首页',
      keepAlive: false
    }
  },
  {
    path: '/conferenceDetail',
    name: 'conferenceDetail',
    component: () => import('@attendee/views/conferenceDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议详情',
      keepAlive: false
    }
  },
  {
    path: '/webConferenceDetail',
    name: 'webConferenceDetail',
    component: () => import('@attendee/views/webConferenceDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议详情',
      keepAlive: false
    }
  },
  {
    path: '/conferenceMeans',
    name: 'conferenceMeans',
    component: () => import('@attendee/views/conferenceMeans/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议资料',
      keepAlive: false
    }
  },
  {
    path: '/conferenceMeansDetail',
    name: 'conferenceMeansDetail',
    component: () => import('@attendee/views/conferenceMeansDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议资料详情',
      keepAlive: false
    }
  },
  {
    path: '/conferenceAgenda',
    name: 'conferenceAgenda',
    component: () => import('@attendee/views/conferenceAgenda/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议议程',
      keepAlive: false
    }
  },
  {
    path: '/conferenceAgendaDetail',
    name: 'conferenceAgendaDetail',
    component: () => import('@attendee/views/conferenceAgendaDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '议程详情',
      keepAlive: false
    }
  },
  {
    path: '/businessCard',
    name: 'businessCard',
    component: () => import('@attendee/views/businessCard/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '个人名片',
      keepAlive: false
    }
  },
  {
    path: '/planofCar',
    name: 'planofCar',
    component: () => import('@attendee/views/planofCar/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车安排',
      keepAlive: false
    }
  },
  {
    path: '/planCommonCarDetail',
    name: 'planCommonCarDetail',
    component: () => import('@attendee/views/planCommonCarDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车详情',
      keepAlive: false
    }
  },
  {
    path: '/planSpecialCarDetail',
    name: 'planSpecialCarDetail',
    component: () => import('@attendee/views/planSpecialCarDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '专车详情',
      keepAlive: false
    }
  },
  {
    path: '/planofStay',
    name: 'planofStay',
    component: () => import('@attendee/views/planofStay/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '住宿安排',
      keepAlive: false
    }
  },
  {
    path: '/planofDining',
    name: 'planofDining',
    component: () => import('@attendee/views/planofDining/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用餐安排',
      keepAlive: false
    }
  },
  {
    path: '/planofTicket',
    name: 'planofTicket',
    component: () => import('@attendee/views/planofTicket/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '票证安排',
      keepAlive: false
    }
  },
  {
    path: '/escort',
    name: 'escort',
    component: () => import('@attendee/views/escort/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '陪同人员',
      keepAlive: false
    }
  },

  {
    path: '/myEscort',
    name: 'myEscort',
    component: () => import('@attendee/views/myEscort/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '我的陪同',
      keepAlive: false
    }
  },
  {
    path: '/escortDetail',
    name: 'escortDetail',
    component: () => import('@attendee/views/escortDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '陪同人员详情',
      keepAlive: false
    }
  },
  {
    path: '/addApply',
    name: 'addApply',
    component: () => import('@attendee/views/addApply/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '报名',
      keepAlive: false
    }
  },
  {
    path: '/applyInfoList',
    name: 'applyInfoList',
    component: () => import('@attendee/views/applyInfoList/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '报名信息',
      keepAlive: false
    }
  },
  {
    path: '/applyInfoDetail',
    name: 'applyInfoDetail',
    component: () => import('@attendee/views/applyInfoDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '报名信息',
      keepAlive: false
    }
  },
  {
    path: '/editApply',
    name: 'editApply',
    component: () => import('@attendee/views/editApply/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '报名变更',
      keepAlive: false
    }
  },
  {
    path: '/editJourney',
    name: 'editJourney',
    component: () => import('@attendee/views/editJourney/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '行程变更',
      keepAlive: false
    }
  },
  {
    path: '/cancelApply',
    name: 'cancelApply',
    component: () => import('@attendee/views/cancelApply/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '取消报名',
      keepAlive: false
    }
  },
  {
    path: '/applyVacate',
    name: 'applyVacate',
    component: () => import('@attendee/views/applyVacate/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '我要请假',
      keepAlive: false
    }
  },
  {
    path: '/myApplication',
    name: 'myApplication',
    component: () => import('@attendee/views/myApplication/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '我的申请',
      keepAlive: false
    }
  },
  {
    path: '/applicationDetail',
    name: 'applicationDetail',
    component: () => import('@attendee/views/applicationDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '申请详情',
      keepAlive: false
    }
  },
  {
    path: '/conferenceSign',
    name: 'conferenceSign',
    component: () => import('@attendee/views/conferenceSign/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '签到页',
      keepAlive: false
    }
  }
]
