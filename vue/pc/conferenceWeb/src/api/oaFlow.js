import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/oaFlow/getConferenceOaFlowList',
        method: 'GET',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/oaFlow/insertOaFlowInst',
        method: 'POST',
        data: data
    })
}

export function withdraw(data) {
    return request({
        url: '/oaFlow/withdraw',
        method: 'POST',
        data: data
    })
}

export function getOaFlowLogByAttendeeId(data) {
    return request({
        url: '/oaFlow/getOaFlowLogByAttendeeId',
        method: 'GET',
        params: data
    })
}

export function getTemplateList(data) {
    return request({
        url: '/oaFlow/getTemplateList',
        method: 'GET',
        params: data
    })
}

