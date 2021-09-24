/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-02 10:09:27
 */
/**
 * 基础路由
 * @type { *[] }
 */
// import { driverRouterMap } from './driver'
import airportTransfer from './airportTransfer'
export const constantRouterMap = [
  // ...driverRouterMap,
  ...airportTransfer,
  {
    path: '/home',
    name: 'home',
    alias: '/',
    component: () => import('@conference/views/home/index'),
    meta: {
      title: '会务管理',
      keepAlive: false
    }
  },
  {
    path: '/login',
    name: 'login',
    // component: () => import(/* webpackChunkName: "login" */ '@/views/login/index')
    component: () => import('@conference/views/login/index'),
    meta: {
      title: '登录',
      keepAlive: false,
      // 不需要登录验证的组件
      isNoAuth: true
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@conference/views/search/index'),
    meta: {
      title: '搜索会议活动',
      keepAlive: false
    }
  },
  {
    path: '/searchList',
    name: 'searchList',
    component: () => import('@conference/views/searchList/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '搜索结果',
      keepAlive: false
    }
  },
  {
    path: '/backlog',
    name: 'backlog',
    component: () => import('@conference/views/backlog/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项',
      keepAlive: false
    }
  },
  {
    path: '/conferenceDesk',
    name: 'conferenceDesk',
    component: () => import('@conference/views/conferenceDesk/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/enterCode',
    name: 'enterCode',
    component: () => import('@conference/views/enterCode/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@conference/views/detail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议详情页',
      keepAlive: false
    }
  },
  {
    path: '/addAttendee',
    name: 'addAttendee',
    component: () => import('@conference/views/addAttendee/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加参会人',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/myPlan',
    name: 'myPlan',
    component: () => import('@conference/views/myPlan/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '我的安排',
      keepAlive: false
    }
  },
  {
    path: '/material',
    name: 'material',
    component: () => import('@conference/views/material/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议资料',
      keepAlive: false
    }
  },
  {
    path: '/agenda',
    name: 'agenda',
    component: () => import('@conference/views/agenda/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '议程信息',
      keepAlive: false
    }
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('@conference/views/contacts/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '常用联系人',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/materialDetail',
    name: 'materialDetail',
    component: () => import('@conference/views/materialDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会议资料详情',
      keepAlive: false
    }
  },
  {
    path: '/enrollManage',
    name: 'enrollManage',
    component: () => import('@conference/views/enrollManage/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '报名管理',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/planCar',
    name: 'planCar',
    component: () => import('@conference/views/planCar/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车安排',
      keepAlive: false
    }
  },
  {
    path: '/planStay',
    name: 'planStay',
    component: () => import('@conference/views/planStay/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '住宿管理',
      keepAlive: false
    }
  },
  {
    path: '/planMeal',
    name: 'planMeal',
    component: () => import('@conference/views/planMeal/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用餐安排',
      keepAlive: false
    }
  },
  {
    path: '/planCard',
    name: 'planCard',
    component: () => import('@conference/views/planCard/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '票证安排',
      keepAlive: false
    }
  },
  {
    path: '/formCar',
    name: 'formCar',
    component: () => import('@conference/views/formCar/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车详情',
      keepAlive: false
    }
  },
  {
    path: '/formStay',
    name: 'formStay',
    component: () => import('@conference/views/formStay/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '住宿详情',
      keepAlive: false
    }
  },
  {
    path: '/formMeal',
    name: 'formMeal',
    component: () => import('@conference/views/formMeal/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用餐详情',
      keepAlive: false
    }
  },
  {
    path: '/formCard',
    name: 'formCard',
    component: () => import('@conference/views/formCard/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '票证详情',
      keepAlive: false
    }
  },
  {
    path: '/myAccompany',
    name: 'myAccompany',
    component: () => import('@conference/views/myAccompany/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '我的陪同',
      keepAlive: false
    }
  },
  {
    path: '/attendee',
    name: 'attendee',
    component: () => import('@conference/views/attendee/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '参会人信息',
      keepAlive: false
    }
  },
  {
    path: '/getAttendee',
    name: 'getAttendee',
    component: () => import('@conference/views/getAttendee/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '参会人查询',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/getAttent',
    name: 'getAttent',
    component: () => import('@conference/views/follow/getFollow'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '我的关注',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/addAttent',
    name: 'addAttent',
    component: () => import('@conference/views/follow/addFollow'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加关注人',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/manageUseCar',
    name: 'manageUseCar',
    component: () => import('@conference/views/manageUseCar/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车管理',
      keepAlive: false
    }
  },
  {
    path: '/formUserCarManage',
    name: 'formUserCarManage',
    component: () => import('@conference/views/formUserCarManage/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车管理详情',
      keepAlive: false
    }
  },
  {
    path: '/manageStay',
    name: 'manageStay',
    component: () => import('@conference/views/manageStay/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '住宿管理',
      keepAlive: false
    }
  },
  {
    path: '/stayAdd',
    name: 'stayAdd',
    component: () => import('@conference/views/manageStay/add'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '参会人信息',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/formStayManage',
    name: 'formStayManage',
    component: () => import('@conference/views/formStayManage/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '住宿管理详情',
      keepAlive: false
    }
  },
  {
    path: '/manageStayStaff',
    name: 'manageStayStaff',
    component: () => import('@conference/views/manageStayStaff/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '入住人员',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/manageDriver',
    name: 'manageDriver',
    component: () => import('@conference/views/manageDriver/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '司机管理',
      keepAlive: false,
      waterMark: true
    }
  },
  // {
  //   path: '/manageDriverDetail',
  //   name: 'manageDriverDetail',
  //   component: () => import('@conference/views/manageDriverDetail/index'),
  //   props: (route) => ({ routeParams: route.query }),
  //   meta: {
  //     title: '司机详情',
  //     keepAlive: false
  //   }
  // },
  {
    path: '/manageCars',
    name: 'manageCars',
    component: () => import('@conference/views/manageCars/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '车辆管理',
      keepAlive: false
    }
  },
  // {
  //   path: '/manageCarsDetail',
  //   name: 'manageCarsDetail',
  //   component: () => import('@conference/views/manageCarsDetail/index'),
  //   props: (route) => ({ routeParams: route.query }),
  //   meta: {
  //     title: '车辆管理详情',
  //     keepAlive: false
  //   }
  // },
  {
    path: '/manageMeal',
    name: 'manageMeal',
    component: () => import('@conference/views/manageMeal/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用餐管理',
      keepAlive: false
    }
  },
  {
    path: '/formMealManage',
    name: 'formMealManage',
    component: () => import('@conference/views/formMealManage/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用餐管理',
      keepAlive: false
    }
  },
  {
    path: '/manageMealStaff',
    name: 'manageMealStaff',
    component: () => import('@conference/views/manageMealStaff/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用餐人员',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/manageUseCarStaff',
    name: 'manageUseCarStaff',
    component: () => import('@conference/views/manageUseCarStaff/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车已分配人员',
      keepAlive: false
    }
  },
  {
    path: '/manageCard',
    name: 'manageCard',
    component: () => import('@conference/views/manageCard/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '票证管理',
      keepAlive: false
    }
  },
  {
    path: '/manageCardPerson',
    name: 'manageCardPerson',
    component: () => import('@conference/views/manageCardPerson/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '证件分配-人员',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/addCardPerson',
    name: 'addCardPerson',
    component: () => import('@conference/views/manageCardPerson/add'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加用证人员',
      keepAlive: false
    }
  },
  {
    path: '/manageCardCars',
    name: 'manageCardCars',
    component: () => import('@conference/views/manageCardCars/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '证件分配-车辆',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/manageCheckIn',
    name: 'manageCheckIn',
    component: () => import('@conference/views/manageCheckIn/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '报到管理',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/manageSignIn',
    name: 'manageSignIn',
    component: () => import('@conference/views/manageSignIn/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '签到管理',
      keepAlive: false
    }
  },
  {
    path: '/manageSignInList',
    name: 'manageSignInList',
    component: () => import('@conference/views/manageSignInList/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/attendeeForms',
    name: 'attendeeForms',
    component: () => import('@conference/views/attendeeForms/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '报名信息',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/editAttendee',
    name: 'editAttendee',
    component: () => import('@conference/views/editAttendee/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '修改参会人报名信息',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/addDriver',
    name: 'addDriver',
    component: () => import('@conference/views/addDriver/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加司机',
      keepAlive: false
    }
  },
  {
    path: '/editDriver',
    name: 'editDriver',
    component: () => import('@conference/views/editDriver/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '编辑司机',
      keepAlive: false
    }
  },
  {
    path: '/addLeave',
    name: 'addLeave',
    component: () => import('@conference/views/addLeave/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '请假',
      keepAlive: false
    }
  },
  {
    path: '/addMeal',
    name: 'addMeal',
    component: () => import('@conference/views/addMeal/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加用餐',
      keepAlive: false
    }
  },
  {
    path: '/addMealUser',
    name: 'addMealUser',
    component: () => import('@conference/views/addMealUser/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加用餐人',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/addUserCar',
    name: 'addUserCar',
    component: () => import('@conference/views/addUserCar/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加用车任务',
      keepAlive: false
    }
  },
  {
    path: '/editUserCar',
    name: 'editUserCar',
    component: () => import('@conference/views/editUserCar/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '编辑用车任务',
      keepAlive: false
    }
  },
  {
    path: '/addCarUser',
    name: 'addCarUser',
    component: () => import('@conference/views/addCarUser/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加用车任务',
      keepAlive: false
    }
  },
  {
    path: '/addCar',
    name: 'addCar',
    component: () => import('@conference/views/addCar/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '添加车辆',
      keepAlive: false
    }
  },
  {
    path: '/editCar',
    name: 'editCar',
    component: () => import('@conference/views/editCar/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '编辑车辆信息',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/jump',
    name: 'jump',
    component: () => import('@conference/views/jump/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '会务系统',
      keepAlive: false
    }
  },
  {
    path: '/attendeeFormsChange',
    name: 'attendeeFormsChange',
    component: () => import('@conference/views/attendeeFormsChange/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '报名信息',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/attendeeFormsCancel',
    name: 'attendeeFormsCancel',
    component: () => import('@conference/views/attendeeFormsCancel/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '取消信息审核',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/editAttendeeChange',
    name: 'editAttendeeChange',
    component: () => import('@conference/views/editAttendeeChange/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '修改参会人报名信息',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/jumpMiddle',
    name: 'jumpMiddle',
    component: () => import('@conference/views/jumpMiddle/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '签到/报到',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/leave',
    name: 'backlogDetail/leave',
    component: () => import('@conference/views/backlogDetail/leave'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项 - 请假审核',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/resource',
    name: 'backlogDetail/resource',
    component: () => import('@conference/views/backlogDetail/resource'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/stay',
    name: 'backlogDetail/stay',
    component: () => import('@conference/views/backlogDetail/stay'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/useCar',
    name: 'backlogDetail/useCar',
    component: () => import('@conference/views/backlogDetail/useCar'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/freeCars',
    name: 'backlogDetail/freeCars',
    component: () => import('@conference/views/backlogDetail/freeCars'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/cars',
    name: 'backlogDetail/cars',
    component: () => import('@conference/views/backlogDetail/cars'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/userCars',
    name: 'backlogDetail/userCars',
    component: () => import('@conference/views/backlogDetail/userCars'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/meal',
    name: 'backlogDetail/meal',
    component: () => import('@conference/views/backlogDetail/meal'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '待办事项',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/index',
    name: 'backlogDetail/index',
    component: () => import('@conference/views/backlogDetail/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '已办事项',
      keepAlive: false
    }
  },
  {
    path: '/backlogDetail/card',
    name: 'backlogDetail/card',
    component: () => import('@conference/views/backlogDetail/card'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '票证分配',
      keepAlive: false
    }
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@conference/views/message/audit'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '消息审核',
      keepAlive: false
    }
  },
  {
    path: '/messageList',
    name: 'messageList',
    component: () => import('@conference/views/message/list'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '消息列表',
      keepAlive: false,
      waterMark: true
    }
  },
  {
    path: '/sendMsg',
    name: 'sendMsg',
    component: () => import('@conference/views/message/sendMsg'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '消息推送',
      keepAlive: false
    }
  },
  {
    path: '/addMsg',
    name: 'addMsg',
    component: () => import('@conference/views/message/addMsg'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '推送新消息',
      keepAlive: false
    }
  },
  {
    path: '/auditEntrance',
    name: 'auditEntrance',
    component: () => import('@conference/views/auditManage/auditEntrance'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '审核管理',
      keepAlive: false
    }
  },
  {
    path: '/carAudit',
    name: 'carAudit',
    component: () => import('@conference/views/auditManage/carAudit'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用车安排审核',
      keepAlive: false
    }
  },
  {
    path: '/carPeopleInfo',
    name: 'carPeopleInfo',
    component: () => import('@conference/views/auditManage/carPeopleInfo'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '乘车人信息',
      keepAlive: false
    }
  },
  {
    path: '/msgPeopleInfo',
    name: 'msgPeopleInfo',
    component: () => import('@conference/views/auditManage/msgPeopleInfo'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '接收人信息',
      keepAlive: false
    }
  },
  {
    path: '/dinnerAudit',
    name: 'dinnerAudit',
    component: () => import('@conference/views/auditManage/dinnerAudit'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用餐安排审核',
      keepAlive: false
    }
  },
  {
    path: '/dinnerPeopleInfo',
    name: 'dinnerPeopleInfo',
    component: () => import('@conference/views/auditManage/dinnerPeopleInfo'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '用餐人员信息',
      keepAlive: false
    }
  },
  {
    path: '/ticketAudit',
    name: 'ticketAudit',
    component: () => import('@conference/views/auditManage/ticketAudit'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '票证安排审核',
      keepAlive: false
    }
  },
  {
    path: '/stayAudit',
    name: 'stayAudit',
    component: () => import('@conference/views/auditManage/stayAudit'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '住宿安排审核',
      keepAlive: false
    }
  },
  {
    path: '/stayPeopleInfo',
    name: 'stayPeopleInfo',
    component: () => import('@conference/views/auditManage/stayPeopleInfo'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '住宿人员信息',
      keepAlive: false
    }
  },
  {
    path: '/buildMeet',
    name: 'buildMeet',
    component: () => import('@conference/views/buildMeet/index'),
    props: (route) => ({ routeParams: route.query }),
    meta: {
      title: '创建会议',
      keepAlive: false
    }
  }
]
