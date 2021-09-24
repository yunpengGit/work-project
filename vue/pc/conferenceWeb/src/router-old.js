import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Layout from './layout'
import LayoutBlank from './layout/indexForBlank'

Vue.use(Router)

export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        hidden: true,
        component: () => import('@/views/login/index')
    },
    {
        path: '/',
        hidden: true,
        component: () => import('@/views/sso/index')
    },
    {
        path: '/index',
        component: () => import('@/views/platform/platformLayout'),
        name: 'AppIndex',
        children: [
            {
                path: '/index',
                component: () => import('@/views/platform/platform'),
                name: 'platform'
            },
            {
                path: 'dataScreen',
                component: () => import('@/views/dataScreen/dataScreenLayout'),
                name: 'dataScreen'
            }
        ]
    },
    {
        path: '/platformLayout',
        component: () => import('@/views/platform/platformLayout'),
        name: 'platformLayout',
        children: [
            {
                path: 'platform',
                component: () => import('@/views/platform/platform'),
                name: 'platform'
            },
            {
                path: 'dataScreen',
                component: () => import('@/views/dataScreen/dataScreenLayout'),
                name: 'dataScreen'
            }
        ]
    },
    {
        path: '/data',
        component: Layout,
        // component: () => import('@/layout/indexcopy.vue'),
        meta: { title: '会议活动总览', icon: 'el-icon-paperclip' },
        children: [
            {
                path: '/data',
                name: 'data',
                hidden: true,
                component: () => import('@/views/conferenceOverview/index'),
                meta: { title: '会议活动总览' }
            }
        ]
    },
    {
        path: '/meetingCreate',
        component: LayoutBlank,
        hidden: true,
        meta: { title: '会议管理', icon: 'el-icon-receiving' },
        children: [
            {
                path: 'create',
                name: 'conferenceCreate',
                component: () => import('@/views/meetingMage/creatMeeting/index-add'),
                meta: { title: '基本信息' }
            },
            {
                path: 'todoWorkList/:conferenceId',
                name: 'todoWorkList',
                component: () => import('@/views/todoWork'),
                meta: { title: '待办列表' }
            }
        ]
    },
    {
        path: '/meeting/update',
        component: Layout,
        meta: { title: '会议活动详情', icon: 'el-icon-receiving' },
        children: [
            {

                meta: { title: '会议活动详情' },
                // path: 'creat/:newsID(\\d+)',
                path: '/meeting/update',
                name: 'conferenceUpdate',
                hidden: true,
                component: () => import('@/views/meetingMage/creatMeeting/index')
            }
        ]
    },
    {
        path: '/signupManagement',
        component: Layout,
        // hidden: true,
        meta: { title: '报名管理', icon: 'el-icon-service' },
        children: [
            {
                path: 'signupCheck',
                name: 'signupCheck',
                component: () => import('@/views/attendee/signupManage/signupCheck'),
                meta: { title: '报名审核' }
            },
            {
                path: 'signupQuery',
                name: 'signupQuery',
                component: () => import('@/views/attendee/signupManage/signupQuery'),
                meta: { title: '报名人查询' }
            }
        ]
    },
    {
        path: '/attendeeManagement',
        component: Layout,
        // hidden: true,
        meta: { title: '参会人管理', icon: 'el-icon-service' },
        children: [
            {
                path: 'attendeeChangeQuery',
                name: 'attendeeChangeQuery',
                component: () => import('@/views/attendee/attendeeManage/changeList'),
                meta: { title: '变更审核管理' }
            },
            {
                path: 'attendeeQuery',
                name: 'attendeeQuery',
                component: () => import('@/views/attendee/attendeeManage'),
                meta: { title: '参会人管理' }
            },
            {
                path: 'attendeeAgenda',
                name: 'attendeeAgenda',
                component: () => import('@/views/attendee/agenda'),
                meta: { title: '议程管理' }
            },
            {
                path: 'attendeeTag',
                name: 'attendeeTag',
                component: () => import('@/views/attendee/tag'),
                meta: { title: '标签管理' }
            },
            {
                path: 'attendeeGroup',
                name: 'attendeeGroup',
                component: () => import('@/views/attendee/group'),
                meta: { title: '分组管理' }
            },
            {
                path: 'attendee/signup/:id',
                name: 'attendeeViewForSignUp',
                hidden: true,
                component: () => import('@/views/attendee/components/attendeeView'),
                meta: { title: '报名信息' }
            },
            {
                path: 'attendee/edit/:id',
                name: 'attendeeViewForUpdate',
                hidden: true,
                component: () => import('@/views/attendee/components/attendeeView'),
                meta: { title: '参会人信息' }
            },
            {
                path: 'attendee/check/:id/:type/:taskId',
                name: 'attendeeViewForCheck',
                hidden: true,
                component: () => import('@/views/attendee/components/attendeeView'),
                meta: { title: '审核参会人' }
            }
        ]
    },

    {
        path: '/contactManage',
        component: Layout,
        meta: { title: '联络人管理', icon: 'el-icon-user' },
        children: [
            {

                meta: { title: '联络人管理' },
                // path: 'creat/:newsID(\\d+)',
                path: '/contactManage',
                name: 'contactList',
                hidden: true,
                component: () => import('@/views/contact')
            }
        ]
    },
    {
        path: '/conferenceGroupManagement',
        component: Layout,
        // hidden: true,
        meta: { title: '会务组管理', icon: 'el-icon-service' },
        children: [
            {
                path: 'conferenceGroupUser',
                name: 'conferenceGroupUser',
                component: () => import('@/views/conferenceGroup/user'),
                meta: { title: '人员管理' }
            }
            // {
            //     path: 'conferenceGroupRole',
            //     name: 'conferenceGroupRole',
            //     component: () => import('@/views/attendee/signupManage/signupCheck'),
            //     meta: { title: '角色管理' }
            // }
        ]
    },
    {
        path: '/carManager',
        component: Layout,
        // component: () => import('@/layout/indexcopy.vue'),
        meta: { title: '车辆管理', icon: 'el-icon-date' },
        children: [

            {
                path: 'carTask',
                name: 'carTask',
                component: () => import('@/views/carManage/carTask/index'),
                meta: { title: '车辆任务管理' }
            },
            {
                path: 'carResources',
                name: 'carResources',
                component: () => import('@/views/carManage/carResources/index'),
                meta: { title: '车辆信息管理' }
            },
            {
                path: 'addAttendee',
                name: 'addAttendee',
                hidden: true,
                component: () => import('@/views/carManage/attendee/index'),
                meta: { title: '任务添加人员' }
            },
            {
                path: 'distribution',
                name: 'distribution',
                hidden: false,
                component: () => import('@/views/carManage/distribution/index'),
                meta: { title: '车辆分配' }
            },
            {
                path: 'attendeeInfo',
                name: 'attendeeInfo',
                hidden: false,
                component: () => import('@/views/carManage/attendeeInfo/index'),
                meta: { title: '用车人员查询' }
            }
        ]
    },
    {
        path: '/cardManager',
        component: Layout,
        // component: () => import('@/layout/indexcopy.vue'),
        meta: { title: '票证管理', icon: 'el-icon-date' },
        children: [
            {
                path: 'cardPlan',
                name: 'cardPlan',
                component: () => import('@/views/cardManage/cardPlan/index'),
                meta: { title: '制证计划' }
            },
            {
                path: 'cardResources',
                name: 'cardResources',
                component: () => import('@/views/cardManage/cardResources/index'),
                meta: { title: '票证资源' }
            },
            {
                path: 'addVehicleCard',
                name: 'addVehicleCard',
                hidden: true,
                component: () => import('@/views/cardManage/cardResources/components/addVehicleCard'),
                meta: { title: '车证信息' }
            }
        ]
    }, {
        path: '/hotelManager',
        component: Layout,
        // component: () => import('@/layout/indexcopy.vue'),
        meta: { title: '住宿管理', icon: 'el-icon-date' },
        children: [
            {
                path: 'hotelPlan',
                name: 'hotelPlan',
                component: () => import('@/views/hotelManage/hotelPlan/index'),
                meta: { title: '用房计划' }
            },
            {
                path: 'hotelResources',
                name: 'hotelResources',
                component: () => import('@/views/hotelManage/hotelResources/index'),
                meta: { title: '住宿资源' }
            }

        ]
    },
    {
        path: '/dining',
        component: Layout,
        // hidden: true,
        meta: { title: '餐厅管理', icon: 'el-icon-share' },
        children: [
            {
                path: 'diningTask',
                name: 'diningTask',
                component: () => import('@/views/diningManage/diningTask'),
                meta: { title: '用餐任务' }
            },
            {
                path: 'diningResources',
                name: 'diningResources',
                component: () => import('@/views/diningManage/diningResources'),
                meta: { title: '餐饮资源' }
            }
        ]
    }
]

const map = {
    // 'canyin': () => import('@/views/diningManage/diningResources'),
    // 'canyin1': () => import('@/views/diningManage/diningResources')
    // 'RouteList': () => import('@/views/operation/inspection/route/route-list.vue'),
    // 'PlanList': () => import('@/views/operation/inspection/plan/plan-list.vue'),
    // 'InspectionList': () => import('@/views/operation/inspection/inspection/inspection-list.vue'),
    // 'FaultList': () => import('@/views/operation/inspection/fault/fault-list.vue'),
    // 'InspectionHistory': () => import('@/views/operation/inspection/inspection/inspection-history.vue'),
    // 'StatisticsEqu': () => import('@/views/operation/inspection/inspection/statistics-equ.vue'),
    // 'StatisticsRoute': () => import('@/views/operation/inspection/inspection/statistics-route.vue'),
    // 'StatisticsPromptness': () => import('@/views/operation/inspection/inspection/statistics-promptness.vue')
}

export function createRoutes(routeMap) {
    // console.log(JSON.stringify(routeMap))
    return routeMap.forEach(item => {
        if (item.component === 'Layout') {
            item.component = Layout
        } else {
            item.component = map[item.component]
        }

        // if (item.path === '/') {
        //     item.redirect = '/monitor-overview'
        // }
        if (item.children) {
            createRoutes(item.children)
        } else {
            delete item['children']
        }
    })
}

const createRouter = () => new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
