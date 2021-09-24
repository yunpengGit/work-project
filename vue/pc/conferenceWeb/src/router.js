import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Layout from './layout'
import LayoutBlank from './layout/indexForBlank'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

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
        path: '/errorPage',
        component: () => import('@/views/index/error'),
        hidden: true
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
                path: 'todoWorkList-old/:conferenceId',
                name: 'todoWorkList-old',
                component: () => import('@/views/todoWork'),
                meta: { title: '待办列表' }
            },
            {
                path: '/selectConferenceTemplate',
                name: 'SelectConferenceTemplate',
                component: () => import('@/views/meetingMage/creatMeeting/selectConferenceTemplate'),
                meta: { title: '选择会议活动模板' }
            },
            {
                path: '/conferenceView',
                name: 'ConferenceView',
                component: () => import('@/views/meetingMage/creatMeeting/conferenceView'),
                meta: { title: '会议活动详情' }
            }
        ]
    },
    {
        path: '/meetingCreate',
        component: Layout,
        hidden: true,
        meta: { title: '会议管理', icon: 'el-icon-receiving' },
        children: [
            {
                path: '/qiandaoguanli',
                name: 'qiandaoguanli',
                hidden: true,
                component: () => import('@/views/attendee/signinManage'),
                meta: { title: '签到' }
            },
            {
                path: 'todoWorkList/:conferenceId',
                name: 'todoWorkList',
                hidden: true,
                component: () => import('@/views/todoWork'),
                meta: { title: '待办列表' }
            },
            {
                path: '/attendeeManagement/attendee/signup/:id',
                name: 'attendeeViewForSignUp',
                hidden: true,
                component: () => import('@/views/attendee/components/attendeeView'),
                meta: { title: '代报名' }
            },
            {
                path: '/attendeeManagement/attendee/edit/:id',
                name: 'attendeeViewForUpdate',
                hidden: true,
                component: () => import('@/views/attendee/components/attendeeView'),
                meta: { title: '添加参会人' }
            },
            {
                path: '/attendee/noticeInside',
                name: 'attendeeNoticeInside',
                hidden: true,
                component: () => import('@/views/noticeInside/list-attendee'),
                meta: { title: '通知列表' }
            },
            {
                path: '/attendeeManagement/attendee/check/:id/:type/:taskId',
                name: 'attendeeViewForCheck',
                hidden: true,
                component: () => import('@/views/attendee/components/attendeeView'),
                meta: { title: '审核' }
            },
            {
                path: '/carManager/addAttendee',
                name: 'addAttendee',
                hidden: true,
                component: () => import('@/views/carManage/attendee/index'),
                meta: { title: '用车任务查看人员' }
            },
            {
                path: '/dining/addAttendee',
                name: 'addAttendee',
                hidden: true,
                component: () => import('@/views/diningManage/attendee/index'),
                meta: { title: '用餐任务查看人员' }
            },
            {
                path: '/msg/msglog/list/:code',
                name: 'msgLogList',
                hidden: true,
                component: () => import('@/views/msg/log/list'),
                meta: { title: '消息发送日志' }
            },
            {
                path: '/msg/msgcheck/list',
                name: 'msgCheckList',
                hidden: true,
                component: () => import('@/views/msg/check/list'),
                meta: { title: '接收人信息' }
            },
            {
                path: '/msg1',
                name: 'msgLogList1',
                hidden: true,
                component: () => import('@/views/msg/log'),
                meta: { title: '消息发送日志' }
            },
            
            {
                path: '/zhuanche',
                name: 'zhuancheList',
                hidden: true,
                component: () => import('@/views/carManage/carTask/special'),
                meta: { title: '专车分配' }
            },
            {
                path: '/contact',
                name: 'conferenceContact',
                hidden: true,
                component: () => import('@/views/conferenceOverview/contact'),
                meta: { title: '常用联系人' }
            },
            {
                path: '/attendeeManagement/attendee/show/:id',
                name: 'attendeeViewForShow',
                hidden: true,
                component: () => import('@/views/attendee/components/attendeeView'),
                meta: { title: '参会人信息' }
            },
            {
                path: '/huiyiyaoqing',
                name: 'huiyiyaoqing',
                hidden: true,
                component: () => import('@/views/attendee/invitation'),
                meta: { title: '会议邀请' }
            }
            // {
            //     path: '/hotelManager/hotelDistribution',
            //     name: 'hotelDistribution',
            //     hidden: false,
            //     component: () => import('@/views/hotelManage/distribution/index'),
            //     meta: { title: '住宿分配' }
            // },
            // {
            //     path: '/hotelManager/hotelAttendeeInfo',
            //     name: 'hotelAttendeeInfo',
            //     hidden: false,
            //     component: () => import('@/views/hotelManage/attendeeInfo/index'),
            //     meta: { title: '住宿人员查询' }
            // }
        ]
    }
    // {
    //     path: '/meeting/update',
    //     component: Layout,
    //     meta: { title: '会议活动详情', icon: 'el-icon-receiving' },
    //     children: [
    //         {

    //             meta: { title: '会议活动详情' },
    //             // path: 'creat/:newsID(\\d+)',
    //             path: '/meeting/update',
    //             name: 'conferenceUpdate',
    //             hidden: true,
    //             component: () => import('@/views/meetingMage/creatMeeting/index')
    //         }
    //     ]
    // }

]

const map = {
    'conferenceOverview': () => import('@/views/conferenceOverview/index'),
    'conferenceUpdate': () => import('@/views/meetingMage/creatMeeting/index'),
    'signupCheck': () => import('@/views/attendee/signupManage/signupCheck'),
    'signupQuery': () => import('@/views/attendee/signupManage/signupQuery'),
    'attendeeChangeQuery': () => import('@/views/attendee/attendeeManage/changeList'),
    'attendeeQuery': () => import('@/views/attendee/attendeeManage'),
    'attendeeAgenda': () => import('@/views/attendee/agenda'),
    'attendeeTag': () => import('@/views/attendee/tag'),
    'attendeeGroup': () => import('@/views/attendee/group'),
    'contactList': () => import('@/views/contact'),
    'conferenceGroupUser': () => import('@/views/conferenceGroup/user'),
    'carTask': () => import('@/views/carManage/carTask/index'),
    'carResources': () => import('@/views/carManage/carResources/index'),
    'distribution': () => import('@/views/carManage/distribution/index'),
    'attendeeInfo': () => import('@/views/carManage/attendeeInfo/index'),
    'cardPlan': () => import('@/views/cardManage/cardPlan/index'),
    'cardResources': () => import('@/views/cardManage/cardResources/index'),
    'cardDistribution': () => import('@/views/cardManage/distribution/index'),
    'cardAttendeeInfo': () => import('@/views/cardManage/attendeeInfo/index'),
    'hotelPlan': () => import('@/views/hotelManage/hotelPlan/index'),
    'hotelResources': () => import('@/views/hotelManage/hotelResources/index'),
    'hotelDistribution': () => import('@/views/hotelManage/distribution/index'),
    'hotelAttendeeInfo': () => import('@/views/hotelManage/attendeeInfo/index'),
    'diningTask': () => import('@/views/diningManage/diningTask'),
    'diningResources': () => import('@/views/diningManage/diningResources'),
    'diningDistribution': () => import('@/views/diningManage/distribution/index'),
    'diningAttendeeInfo': () => import('@/views/diningManage/attendeeInfo/index'),
    'NoticeInside': () => import('@/views/noticeInside'),
    'conferenceGroupRole': () => import('@/views/conferenceGroup/role'),
    'msgLog': () => import('@/views/msg/log'),
    'msgCheck': () => import('@/views/msg/check'),
    'specialVehicleTask': () => import('@/views/carManage/carTask/special'),
    'signinManage': () => import('@/views/attendee/signinManage'),
    'conferenceInvitation': () => import('@/views/attendee/invitation')

}

export function createRoutes(routeMap) {
    // console.log(JSON.stringify(routeMap))
    return routeMap.forEach(item => {
        // console.log(JSON.stringify(item))

        if (item.component === 'Layout') {
            item.component = Layout
        } else {
            item.component = map[item.component]
        }

        // if (item.path === '/') {
        //     item.redirect = '/monitor-overview'
        // }
        // console.log(item)
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
