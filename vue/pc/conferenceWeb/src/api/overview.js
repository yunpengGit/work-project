import request from '@/utils/request'

export function getContact(data) {
    return request({
        url: '/synergy/common/contact',
        method: 'GET',
        params: data
    })
}

export function getContactByConferenceId(data) {
    return request({
        url: '/conferenceGroupUser/getContactByConferenceId',
        method: 'GET',
        params: data
    })
}

export function getStatistics(data) {
    return request({
        url: '/conferenceStatistics/statistics',
        method: 'GET',
        params: data
    })
}

