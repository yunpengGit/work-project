import request from '@/utils/request'
import Qs from 'qs'

export function getList(data) {
    return request({
        url: '/conference/user/organized',
        method: 'GET',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getAllList(data) {
    return request({
        url: '/conference/lobby',
        method: 'GET',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getView(data) {
    return request({
        url: '/conference/details',
        method: 'GET',
        params: data
    })
}

export function getTempId() {
    return request({
        url: '/conference/tempIdGen',
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conference/insert',
        method: 'POST',
        data: data
    })
}

export function fabu(data) {
    return request({
        url: '/conference/submit',
        method: 'POST',
        params: data
    })
}

export function unPublish(data) {
    return request({
        url: '/conference/unPublish',
        method: 'POST',
        params: data
    })
}

export function cancel(data) {
    return request({
        url: '/conference/cancel',
        method: 'POST',
        params: data
    })
}

export function update(data) {
    return request({
        url: '/conference/update',
        method: 'POST',
        data: data
    })
}

export function deleteById(data) {
    return request({
        url: '/conference/' + data.id + '/cancel',
        method: 'GET'
    })
}

export function checkFull(data) {
    return request({
        url: '/conference/checkFull',
        method: 'GET',
        params: data
    })
}

export function copy(id, copyItems) {
    return request({
        url: '/conference/copy?id=' + id + "&copyItems=" + copyItems,
        method: 'GET'
    })
}

export function downloadFile(param) {
    return request({
        url: '/files/download',
        method: 'get',
        responseType: 'blob',
        params: param
    })
}

export function getSignConfigAll(data) {
    return request({
        url: '/conferenceSignConfig/signForm/union/byConferenceId',
        method: 'GET',
        params: data
    })
}

export function getTemplateList() {
    return request({
        url: '/conferenceTemplate/getBaseList',
        method: 'GET'
    })
}

export function getTemplateView(id) {
    return request({
        url: '/conferenceTemplate//details/byConferenceId?conferenceId=' + id,
        method: 'GET'
    })
}
