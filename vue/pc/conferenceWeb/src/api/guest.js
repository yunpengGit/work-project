import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/conferenceGuest/findByConferenceId',
        method: 'GET',
        params: data
    })
}

export function getView(data) {
    return request({
        url: '/conferenceGuest/findById?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conferenceGuest/',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceGuest/update',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceGuest/deleteByIds',
        method: 'POST',
        data: data
    })
}

export function updateSeq(data) {
    return request({
        url: '/conferenceGuest/order',
        method: 'POST',
        data: data
    })
}

