import request from '@/utils/request'
import Qs from 'qs'

export function exportVehiclTaskAttendee(params) {
    return request({
        url: '/synergy/files/export/vehicle/task/attendee',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportRoomTaskAttendee(params) {
    return request({
        url: '/synergy/files/export/room/task/attendee',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportCardTaskAttendee(params) {
    return request({
        url: '/synergy/files/export/card/task/attendee',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportDinnerTaskAttendee(params) {
    return request({
        url: '/synergy/files/export/dinner/task/attendee',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportVehiclTaskAttendeeQuery(params) {
    return request({
        url: '/synergy/files/export/vehicle/task/attendee/query',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportRoomTaskAttendeeQuery(params) {
    return request({
        url: '/synergy/files/export/room/task/attendee/query',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportCardTaskAttendeeQuery(params) {
    return request({
        url: '/synergy/files/export/card/task/attendee/query',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportCardTaskAttendeeQueryZip(params) {
    return request({
        url: '/synergy/files/export/card/task/attendee/query/zip',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportCardTaskAttendeeZip(params) {
    return request({
        url: '/synergy/files/export/card/task/attendee/zip',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportDinnerTaskAttendeeQuery(params) {
    return request({
        url: '/synergy/files/export/dinner/task/attendee/query',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
