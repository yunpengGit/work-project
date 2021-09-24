import request from '@/utils/request'

export function getUser() {
    return request({
        url: '/user/loginInfo/',
        method: 'get'
    })
}

export function loginInfo() {
    return request({
        url: '/user/loginInfo/',
        method: 'get'
    })
}

export function login(user) {
    return request({
        url: '/login',
        method: 'post',
        data: user
    })
}

export function ssoLogin(user) {
    return request({
        url: '/ssoLogin',
        method: 'post',
        data: user
    })
}

export function logout(token) {
    return request({
        url: '/loginOut',
        method: 'POST',
        data: token
    })
}

export function getMenus(data) {
    return request({
        url: '/menu/getConferenceGroupUserMenus',
        method: 'get',
        params: data
    })
}

export function getMenusNotTree(data) {
    return request({
        url: '/menu/getConferenceGroupUserMenuList',
        method: 'get',
        params: data
    })
}

export function getButtons(data) {
    return request({
        url: '/menu/getConferenceGroupUserButtonList',
        method: 'get',
        params: data
    })
}
