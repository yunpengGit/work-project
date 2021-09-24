import request from '@/utils/request'

export function getSignConfig(data) {
    return request({
        url: '/conferenceSignConfig/getByConferenceId',
        method: 'GET',
        params: data
    })
}

export function setSignConfig(data) {
    return request({
        url: '/conferenceSignConfig/addSignConfig',
        method: 'POST',
        data: data
    })
}

