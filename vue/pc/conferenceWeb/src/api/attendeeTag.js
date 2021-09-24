import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/conferenceTag/getList',
        method: 'GET',
        params: data
    })
}

export function getView(data) {
    return request({
        url: '/conferenceTag/getById?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conferenceTag/add/',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceTag/update/',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceTag/deleteByIds',
        method: 'POST',
        data: data
    })
}

export function insertTagAttendee(data) {
    return request({
        url: '/conferenceTag/insertTagAttendee/',
        method: 'POST',
        data: data
    })
}

export function deleteByAttendeeIdsAndTagId(data) {
    return request({
        url: '/conferenceTag/deleteByAttendeeIdsAndTagId',
        method: 'POST',
        data: data
    })
}

