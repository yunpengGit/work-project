import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/seatingPlan/selectList',
        method: 'GET',
        params: data
    })
}

export function getView(data) {
    return request({
        url: '/seatingPlan/selectById?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/seatingPlan/insertSeatingPlan',
        method: 'POST',
        data: data
    })
}

export function deleteSeatingPlan(data) {
    return request({
        url: '/seatingPlan/deleteSeatingPlan',
        method: 'POST',
        data: data
    })
}

export function filesSeat(data) {
    return request({
        url: '/seatingPlan/seat',
        method: 'GET',
        params: data
    })
}
