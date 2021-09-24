import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/conferenceAccompany/list',
        method: 'GET',
        params: data
    })
}

export function getView(data) {
    return request({
        url: '/conferenceAccompany/details?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conferenceAccompany/insert',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceAccompany/update/',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceAccompany/delete',
        method: 'POST',
        data: data
    })
}

export function insertGroupAttendee(data) {
    return request({
        url: '/conferenceAccompany/insert/attendee',
        method: 'POST',
        data: data
    })
}

export function getAttendeeList(data) {
    return request({
        url: '/conferenceAccompany/list/attendee',
        method: 'GET',
        params: data
    })
}

export function deleteByAttendeeIdsAndGroupId(data) {
    return request({
        url: '/conferenceAccompany/delete/attendee',
        method: 'POST',
        data: data
    })
}
