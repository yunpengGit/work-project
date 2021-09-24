import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/conferenceInviteUser/list',
        method: 'GET',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/conferenceInviteUser/insert',
        method: 'POST',
        data: data
    })
}

export function sendInvite(data) {
    return request({
        url: '/conferenceInviteUser/sendInvite',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceInviteUser/delete',
        method: 'POST',
        data: data
    })
}

export function importInvite(data) {
    return request({
        url: '/noticeInside/insert',
        method: 'POST',
        data: data
    })
}

export function getImportResult(data) {
    return request({
        url: '/conferenceInviteUser/importExcel/result',
        method: 'POST',
        data: data
    })
}

