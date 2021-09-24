import request from '@/utils/request'
import Qs from 'qs'

export function getList(data) {
    return request({
        url: '/conferenceAgenda/findByConferenceId',
        method: 'GET',
        params: data
    })
}

export function getListNoDate(data) {
    return request({
        url: '/conferenceAgenda/queryByConferenceId',
        method: 'GET',
        params: data
    })
}

export function getView(data) {
    return request({
        url: '/conferenceAgenda/findById',
        method: 'GET',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/conferenceAgenda/',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceAgenda/update',
        method: 'POST',
        data: data
    })
}

export function updateSeq(data) {
    return request({
        url: '/conferenceAgenda/updateSeq',
        method: 'POST',
        data: data
    })
}

export function deleteById(data) {
    return request({
        url: '/conferenceAgenda/deleteByIds',
        method: 'POST',
        data: data
    })
}

export function updateByConferenceId(data) {
    return request({
        url: '/conferenceAgendaGroup/updateByConferenceId',
        method: 'POST',
        data: data
    })
}

export function findByConferenceId(data) {
    return request({
        url: '/conferenceAgendaGroup/findByConferenceId',
        method: 'GET',
        params: data
    })
}

export function insertAgendaAttendee(data) {
    return request({
        url: '/conferenceAgenda/insertAgendaAttendee/',
        method: 'POST',
        data: data
    })
}

export function deleteByAttendeeIdsAndAgendaId(data) {
    return request({
        url: '/conferenceAgenda/deleteByAttendeeIdsAndAgendaId',
        method: 'POST',
        data: data
    })
}

export function getListByUser(data) {
    return request({
        url: '/conferenceAgenda/getAgendaAttendeeListByUser',
        method: 'GET',
        params: data
    })
}

export function agendaSignInByOrganized(data) {
    return request({
        url: '/attendeeManage/agendaSignIn/ByOrganized',
        method: 'POST',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function agendaCancelByOrganized(data) {
    return request({
        url: '/attendeeManage/agendaCancel/ByOrganized',
        method: 'POST',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function selectListByGroupUserOrAttendee(data) {
    return request({
        url: '/conferenceAgenda/selectListByGroupUserOrAttendee',
        method: 'GET',
        params: data
    })
}

export function queryListByDate(data) {
    return request({
        url: '/conferenceAgenda/queryListByDate',
        method: 'GET',
        params: data
    })
}

export function getXingchengListByUser(data) {
    return request({
        url: '/synergy/common/synergy/tree',
        method: 'GET',
        params: data
    })
}

export function exportAgendaAttendee(params) {
    return request({
        url: '/excel//export/agenda/attendee',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getImportResult(data) {
    return request({
        url: '/excel/importExcel/result',
        method: 'POST',
        data: data
    })
}
