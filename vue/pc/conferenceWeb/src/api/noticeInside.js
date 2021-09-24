import request from '@/utils/request'
import Qs from 'qs'

export function getList(data) {
    return request({
        url: '/noticeInside/getList',
        method: 'GET',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getView(data) {
    return request({
        url: '/noticeInside/getView?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/noticeInside/insert',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/noticeInside/update',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/noticeInside/deleteBatch',
        method: 'POST',
        data: data
    })
}

export function updateStatusBatch(data) {
    return request({
        url: '/noticeInside/updateStatusBatch',
        method: 'POST',
        data: data
    })
}
