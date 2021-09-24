import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/log/list/businesse',
        method: 'GET',
        params: data
    })
}

