import request from '@/utils/request'
import Qs from 'qs'

export function getImportAttendeeModel(params) {
    return request({
        url: '/excel/export/attendeeList/importTemplateExcel',
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
        url: '/excel/attendee/importExcel/result',
        method: 'POST',
        data: data
    })
}

export function getList(data) {
    return request({
        url: '/attendeeManage/list/organized',
        method: 'GET',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getChangeView(data) {
    return request({
        url: '/attendeeManage/details/findAttendeeOrRecordById',
        method: 'GET',
        params: data
    })
}

export function getView(data) {
    return request({
        url: '/attendeeManage/details/findAttendeeOrRecordById',
        method: 'GET',
        params: data
    })
}

export function getUser(data) {
    return request({
        url: '/user/getUserByUserNameAndMobile',
        method: 'GET',
        params: data
    })
}

export function getDraft(data) {
    return request({
        url: '/attendeeManage/getDraft',
        method: 'GET',
        params: data
    })
}

export function getSignForm(data) {
    return request({
        url: '/attendeeManage/getSignForm',
        method: 'GET',
        params: data
    })
}

export function update(data) {
    return request({
        url: '/attendeeManage/insert',
        method: 'POST',
        data: data
    })
}

export function examine(data) {
    return request({
        url: '/attendeeManage/signAuditAttendeeWithUpdate',
        method: 'POST',
        data: data
    })
}

export function examineBatch(data) {
    return request({
        url: '/attendeeManage/signAuditAttendee',
        method: 'POST',
        data: data
    })
}

export function getHonourList(data) {
    return request({
        url: '/attendeeManage/list/byAttendeeName',
        method: 'GET',
        params: data
    })
}

export function getTaskList(data) {
    return request({
        url: '/attendeeManage/task/list/organized',
        method: 'GET',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }

    })
}

export function getFlightStatus(data) {
    return request({
        url: '/test/getFlightStatus',
        method: 'GET',
        params: data
    })
}

export function getFlightNews(data) {
    return request({
        url: '/etrip/getFlightNews',
        method: 'GET',
        params: data
    })
}

export function vertifybyConferenceId(data) {
    return request({
        url: '/attendeeManage/vertify/byConferenceId',
        method: 'GET',
        params: data
    })
}

export function getTaskView(data) {
    return request({
        url: '/attendeeManage/task/details',
        method: 'GET',
        params: data
    })
}

export function cancelAttendeeMetting(data) {
    return request({
        url: '/attendeeManage/cancelAttendeeMetting',
        method: 'POST',
        data: data
    })
}

export function sendToTask(data) {
    return request({
        url: '/attendeeManage/task/sendToTask',
        method: 'POST',
        data: data
    })
}

export function leaveOrganized(data) {
    return request({
        url: '/attendeeManage/leave/organized',
        method: 'POST',
        data: data
    })
}

export function getTaskCount(data) {
    return request({
        url: '/attendeeManage/task/getCommonWaitCountByTypes',
        method: 'GET',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getPredictColumn(data) {
    return request({
        url: '/attendeeManage/getPredictColumn',
        method: 'GET',
        params: data
    })
}

export function recoverSignStatus(data) {
    return request({
        url: '/attendeeManage/recoverSignStatus',
        method: 'POST',
        data: data
    })
}

export function insertTempAttendee(data) {
    return request({
        url: '/attendeeManage/insertTempAttendee',
        method: 'POST',
        params: data
    })
}

export function findAttendeeIdByNameAndPhone(data) {
    return request({
        url: '/attendeeManage/findAttendeeIdByNameAndPhone',
        method: 'GET',
        params: data
    })
}

export function deleteByIds(data) {
    return request({
        url: '/attendeeManage/delete',
        method: 'POST',
        data: data
    })
}

export function checkInByOrganized(data) {
    return request({
        url: '/attendeeManage/checkIn/ByOrganized',
        method: 'POST',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function cancelCheckInByOrganized(data) {
    return request({
        url: '/attendeeManage/cancel/checkIn/ByOrganized',
        method: 'POST',
        params: data,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getAddressListByConferenceId(params) {
    return request({
        url: '/synergy/common/baseAddressList',
        method: 'get',
        params
    })
}

export function exportExcel(params) {
    return request({
        url: '/excel/export/attendeeList',
        method: 'get',
        params: params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getImportAttendeeSeqResult(data) {
    return request({
        url: '/synergy/files/import/attendee/result',
        method: 'POST',
        data: data
    })
}

export function downloadErrorFile(params) {
    return request({
        url: '/files/downloadErrorFile',
        method: 'get',
        params
    })
}

// export function exportExcel(param) {
//     return request({
//         url: '/excel/export/attendeeList',
//         method: 'get',
//         responseType: 'blob',
//         params: param,
//         paramsSerializer: function(params) {
//             return Qs.stringify(params, { arrayFormat: 'repeat' })
//         }
//     })
// }
// 导出参会人基本信息
export function exportBaseExcel(params) {
    return request({
        url: '/excel/export/attendeeList/base',
        method: 'get',
        responseType: 'blob',
        params: params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 可导出附件列表信息
export function getFileList(params) {
    return request({
        url: '/excel/export/attendeeList/fileList',
        method: 'get',
        params: params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 导出附件信息
export function exportFileList(params) {
    return request({
        url: '/excel/export/attendeeList',
        method: 'get',
        params: params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

