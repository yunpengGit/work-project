import request from '@/utils/request'
import Qs from 'qs'

export function getList(data) {
    return request({
        url: '/conferenceContacter/list',
        method: 'GET',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { contacterRoleIds: 'repeat' })
        }
    })
}

export function getView(data) {
    return request({
        url: '/conferenceContacter/getView?conferenceContacterId=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conferenceContacter/insert',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceContacter/update',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceContacter/cancel',
        method: 'POST',
        data: data
    })
}
