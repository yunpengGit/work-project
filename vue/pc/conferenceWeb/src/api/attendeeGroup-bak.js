import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/conferenceGroup/getList',
        method: 'GET',
        params: data
    })
}

export function getView(data) {
    return request({
        url: '/conferenceGroup/getById?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conferenceGroup/add/',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceGroup/update/',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceGroup/deleteByIds',
        method: 'POST',
        data: data
    })
}

export function insertGroupAttendee(data) {
    return request({
        url: '/conferenceGroup/insertGroupAttendee/',
        method: 'POST',
        data: data
    })
}

export function deleteByAttendeeIdsAndGroupId(data) {
    return request({
        url: '/conferenceGroup/deleteByAttendeeIdsAndGroupId',
        method: 'POST',
        data: data
    })
}
