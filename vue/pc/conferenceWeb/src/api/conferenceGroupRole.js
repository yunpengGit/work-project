import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/conferenceGroupRole/findByConferenceId',
        method: 'GET',
        params: data
    })
}

export function getView(data) {
    return request({
        url: '/conferenceGroupRole/findById?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conferenceGroupRole/',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceGroupRole/update',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceGroupRole/deleteByIds',
        method: 'POST',
        data: data
    })
}

export function getConferenceRes(data) {
    return request({
        url: '/conferenceGroupRole/conferenceRes',
        method: 'GET',
        params: data
    })
}
