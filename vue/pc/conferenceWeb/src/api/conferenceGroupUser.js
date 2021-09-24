import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/conferenceGroupUser/findByConferenceId',
        method: 'GET',
        params: data
    })
}
export function getapprovalProcessList(data) {
    return request({
        url: '/conferenceGroupUser/findByConferenceId',
        method: 'GET',
        params: data
    })
}
export function auditSubmit(data) {
    return request({
        url: '/auditTask/submit',
        method: 'POST',
        data: data
    })
}

export function getView(data) {
    return request({
        url: '/conferenceGroupUser/findById?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conferenceGroupUser/',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceGroupUser/update',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceGroupUser/deleteByIds',
        method: 'POST',
        data: data
    })
}

export function findUsersByConferenceId(data) {
    return request({
        url: '/conferenceGroupUser/findUsersByConferenceId?conferenceId=' + data.conferenceId,
        method: 'GET'
    })
}
