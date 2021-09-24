import request from '@/utils/request'

export function getStatistics(data) {
    return request({
        url: '/msglog/list/statistics',
        method: 'GET',
        params: data
    })
}

export function getList(data) {
    return request({
        url: '/msglog/list',
        method: 'GET',
        params: data
    })
}

export function retrySendMsg(data) {
    return request({
        url: '/msglog/retrySendMsg',
        method: 'POST',
        data: data
    })
}

export function sendManually(data) {
    return request({
        url: '/msglog/manually/send',
        method: 'POST',
        data: data
    })
}

export function getTemplateList(data) {
    return request({
        url: '/msgtemplate/list',
        method: 'get',
        params: data
    })
}


// 获取手动推送表格数据
export function getHandList(data) {
    return request({
        url: '/msglog/manually/list',
        method: 'POST',
        data: data
    })
}

// 审批手动发送信息
export function verifyHand(data) {
    return request({
        url: '/msglog/manually/verify',
        method: 'POST',
        data: data
    })
}