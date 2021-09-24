import request from '@/utils/request'
import Qs from 'qs'
export function exportExcel(param) {
    return request({
        url: '/excel/export/checkInAttendeeList',
        method: 'get',
        responseType: 'blob',
        params: param,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportAgendaSigninExcel(param) {
    return request({
        url: '/excel/export/agenda/checkInAttendeeList',
        method: 'get',
        responseType: 'blob',
        params: param,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

