import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '../router'
import { setOssBaseUrl } from '@/utils/x-sso-baseurl'
import { setOssPublicBaseUrl } from '@/utils/x-sso-publicbaseurl'
import { getConferenceId, setConferenceId, setConferenceTemplate } from '@/utils/conference-auth'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    withCredentials: true,
    timeout: 50000
})

service.interceptors.request.use(
    config => {
        if (store.state.user.token) {
            config.headers.common['authToken'] = store.state.user.token
            config.headers.common['cache-control'] = 'no-cache'
            config.headers.common['Pragma'] = 'no-cache'
        }
        var conferenceId = getConferenceId()
        if (conferenceId !== undefined && conferenceId !== null && conferenceId !== '') {
            config.headers.common['conferenceId'] = conferenceId
        }

        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        // alert(response.headers['x-sso-baseurl'])
        const res = response.data
        if (response !== null && response.headers['x-sso-baseurl'] !== null && response.headers['x-sso-baseurl'] !== undefined) {
            setOssBaseUrl(response.headers['x-sso-baseurl'])
        }
        if (response !== null && response.headers['x-sso-publicbaseurl'] !== null && response.headers['x-sso-publicbaseurl'] !== undefined) {
            setOssPublicBaseUrl(response.headers['x-sso-publicbaseurl'])
        }
        if (res.code) {
            switch (res.code) {
                case 2000:
                    return response.data
                case 7000:
                    return res
                case 6000:
                    Message.error(res.message + '请重新登录')
                    store.dispatch('user/logout').then(() => {
                        router.push({ path: '/' })
                    // location.reload()
                    })
                    break
                case 8000:
                // alert(res.message)
                    Message.error(res.message)
                    break
                case 9000:
                    setConferenceId('')
                    setConferenceTemplate('')
                    router.push({ path: '/errorPage', replace: true })
                    // if (!router.currentRoute.path === '/errorPage') {
                    //     router.push({ path: '/errorPage', replace: true })
                    // }
                    // const { href } = router.resolve({
                    //     path: '/index'
                    // })
                    // router.replace(href)
                    // console.log(router)
                    // if (router.path !== '/index') {
                    //     router.push({ path: '/index' })
                    // }

                    return res
                    // router.push({ path: '/cleansession' })
                default:
                    if (res.message === '会议不存在') {
                        router.push({ path: '/index', replace: true })
                    } else if (res.message === '报名信息发生改变') {
                        console.log(res)
                    } else {
                        Message.error(res.message)
                    }

                    return res
            }
        } else {
            return response
        }
        return res
    },
    error => {
        console.log('err' + error)
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
