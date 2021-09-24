import request from '@/utils/request'

export function getSpecialVehicleList(data) {
    return request({
        url: '/synergy/vehicle/task/vehicle/list',
        method: 'GET',
        params: data
    })
}

export function getSpecialTaskList(data) {
    return request({
        url: '/synergy/vehicle/task/vehicle/task/special/list',
        method: 'GET',
        params: data
    })
}

export function getVehicleTaskById(params) {
    return request({
        url: '/synergy/vehicle/task/detail',
        method: 'get',
        params
    })
}

export function getChildrenVehicleTaskById(params) {
    return request({
        url: '/synergy/vehicle/task/children/list',
        method: 'get',
        params
    })
}

export function getAddressListByConferenceId(params) {
    return request({
        url: '/synergy/vehicle/task/address/list',
        method: 'get',
        params
    })
}

export function getDriverList(params) {
    return request({
        url: '/synergy/driver/listNotInTask',
        method: 'get',
        params
    })
}

export function insert(data) {
    return request({
        url: '/synergy/vehicle/task/special/insert',
        method: 'POST',
        data: data
    })
}

export function cancel(data) {
    return request({
        url: '/synergy/vehicle/task/special/cancel',
        method: 'POST',
        data: data
    })
}

export function addAttendee(data) {
    return request({
        url: '/synergy/vehicle/task/special/attendee/insert',
        method: 'POST',
        data: data
    })
}

export function deleteAttendee(data) {
    return request({
        url: '/synergy/vehicle/task/special/attendee/delete',
        method: 'POST',
        data: data
    })
}

export function getList(data) {
    return request({
        url: '/synergy/vehicle/task/special/list',
        method: 'GET',
        params: data
    })
}

export function getTaskList(data) {
    return request({
        url: '/synergy/vehicle/task/list',
        method: 'GET',
        params: data
    })
}

export function getSpecialTaskView(data) {
    return request({
        url: '/synergy/vehicle/task/special/detail',
        method: 'GET',
        params: data
    })
}

export function getSpecialTaskAttendeeList(data) {
    return request({
        url: '/synergy/vehicle/task/special/attendee/list',
        method: 'GET',
        params: data
    })
}

export function getSpecialTaskByAttendee(data) {
    return request({
        url: '/synergy/vehicle/task/special/attendee/vehicle',
        method: 'GET',
        params: data
    })
}

export function publish(data) {
    return request({
        url: '/synergy/vehicle/task/special/publish',
        method: 'POST',
        data: data
    })
}

export function unPublish(data) {
    return request({
        url: '/synergy/vehicle/task/special/unPublish',
        method: 'POST',
        data: data
    })
}
