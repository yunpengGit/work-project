import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/user-auth'
import { getConferenceId, setConferenceId } from '@/utils/conference-auth'
import { getConferenceTemplate } from '@/utils/conference-auth'
import { getView } from '@/api/conference'
import { getView as getAttendeeView } from '@/api/attendee'
NProgress.configure({ showSpinner: false })
const canhuirenList = ['attendeeViewForUpdate', 'attendeeViewForSignUp', 'attendeeViewForCheck']
const whiteList = ['/login', '/', '/index', '/errorPage'] // no redirect whitelist
const noConferenceNamePaths = ['/index', '/meetingCreate/create', '/meetingCreate/todoWorkList/0', '/index/dataScreen']

const titleContent = '会议活动管理系统'

router.beforeEach(async(to, from, next) => {
    if (canhuirenList.indexOf(to.name) !== -1) {
        if (to.params.id !== null && to.params.id !== '0') {
            await getAttendeeView({ 'id': to.params.id }).then(res => {
                to.meta.title = res.result.signFormConfigFormatVO.attendeeName.fieldValue + '的报名信息'
            })
        } else {
            if (to.name === canhuirenList[1]) {
                to.meta.title = '代报名'
            } else {
                to.meta.title = '添加' + getConferenceTemplate(2)
            }
        }
    }

    if (to.path === '/meetingCreate/create') {
        store.state.user.conferenceName = ''
        setConferenceId('')
        // setConferenceTemplate('')
    }

    if (to.path === '/index') {
        await store.dispatch('tagsBar/delAllViews')
    }
    // next()
    NProgress.start()
    const hasToken = getToken()
    if (hasToken) {
        await store.dispatch('user/getUser')
        // const userId = store.state.user.users.userId
        const conferenceId = getConferenceId()
        const userConferenceId = store.state.user.conferenceId
        if (conferenceId !== userConferenceId && whiteList.indexOf(to.path) === -1 && conferenceId !== null && conferenceId !== '') {
            try {
                if (conferenceId !== undefined && conferenceId !== null && conferenceId !== '') {
                    getView({ 'id': conferenceId }).then(res => {
                        if (res.success) {
                            store.state.user.conferenceName = res.result.name
                        }
                    })
                }
                await store.dispatch('tagsBar/delAllViews')
                store.state.user.conferenceId = conferenceId
                await store.dispatch('menu/getMenus')
                await store.dispatch('menu/getButtons')
                const accessRoutes = await store.dispatch('menu/generateRoutes')

                if (accessRoutes !== null) {
                    router.addRoutes(accessRoutes)
                }
                // console.log(JSON.stringify(accessRoutes))

                next({ ...to, replace: false })
                NProgress.done()
            } catch (error) {
                await store.dispatch('user/logout')
                Message.error(error || 'Has Error')
                next(`/`)
                NProgress.done()
            }
        } else {
            next()
            NProgress.done()
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
            NProgress.done()
        } else {
            next(`/`)
            NProgress.done()
        }
    }
    document.title = noConferenceNamePaths.indexOf(to.path) === -1 ? titleContent : titleContent
})

router.afterEach(() => {
    NProgress.done()
})
