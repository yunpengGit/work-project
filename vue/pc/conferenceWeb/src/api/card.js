import request from '@/utils/request'
import Qs from 'qs'


//证件任务 嘉宾证导出
export function exportTaskAttendee (params) {
    return request({
        url: '/synergy/files/export/card/attendee',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

//证件任务 车证导出
export function exportTaskVehicle (params) {
    return request({
        url: '/synergy/files/export/card/vehicle',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

//证件信息管理导出
export function exportCard (params) {
    return request({
        url: '/synergy/files/export/card',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

//获取导入车正结果
export function getImportVehicleCardResult (data) {
    return request({
        url: '/synergy/files/import/card/vehicle/result',
        method: 'post',
        data
    })
}

//获取导入嘉宾证结果
export function getImportAttendeeCardResult (data) {
    return request({
        url: '/synergy/files/import/card/attendee/result',
        method: 'post',
        data
    })
}

//获取导入证件结果
export function getImportCardResult (data) {
    return request({
        url: '/synergy/files/import/card/result',
        method: 'post',
        data
    })
}

export function getCardList (params) {
    return request({
        url: '/synergy/card/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function addCard (data) {
    return request({
        url: '/synergy/card/insert',
        method: 'post',
        data
    })
}

export function updateCard (data) {
    return request({
        url: '/synergy/card/update',
        method: 'post',
        data
    })
}

export function deleteCard (data) {
    return request({
        url: '/synergy/card/delete',
        method: 'post',
        data
    })
}

// 证件状态列表
export function getCardStatusOptions (params) {
    return request({
        url: '/synergy/common/enum/card/status',
        method: 'get',
        params
    })
}

// 嘉宾证任务列表
export function getAttendeeCardTaskList (params) {
    return request({
        url: '/synergy/card/attendee/getCardAttendeeList',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 车证任务列表
export function getVehicleCardTaskList (params) {
    return request({
        url: '/synergy/card/vehicle/getCardVehicleList',
        method: 'get',
        params
    })
}

// 人证插入
export function addAttendeeCardTask (data) {
    return request({
        url: '/synergy/card/attendee/insert',
        method: 'post',
        data
    })
}

// 车证插入
export function addVehicleCardTask (data) {
    return request({
        url: '/synergy/card/vehicle/insert',
        method: 'post',
        data
    })
}

// 人证更新
export function updateAttendeeCardTask (data) {
    return request({
        url: '/synergy/card/attendee/update',
        method: 'post',
        data
    })
}

// 车证更新
export function updateVehicleCardTask (data) {
    return request({
        url: '/synergy/card/vehicle/update',
        method: 'post',
        data
    })
}

// 人证状态批量更新
export function updateAttendeeCardStatus (data) {
    return request({
        url: '/synergy/card/attendee/updateCardStatusAttendee',
        method: 'post',
        data
    })
}

// 车证状态批量更新
export function updateVehicleCardStatus (data) {
    return request({
        url: '/synergy/card/vehicle/updateCardStatusVehicle',
        method: 'post',
        data
    })
}

// 待办中批量分配嘉宾证
export function batchAddAttendeeCard (data) {
    return request({
        url: '/synergy/card/attendee/insertList',
        method: 'post',
        data
    })
}

// 证件分配查询中查询会议下嘉宾的多个证件信息用到这接口
export function getAttendeeInfoList (params) {
    return request({
        url: '/synergy/card/attendee/getCardList',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 证件分配查询中查询会议下车辆的多个证件信息用到这接口
export function getVehicleInfoList (params) {
    return request({
        url: '/synergy/card/vehicle/getCardList',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 卡片代办列表20201216
export function getCardToDoList (params) {
    return request({
        url: '/synergy/card/card/task/meeting/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 批量发布
export function batchPublish (data) {
    return request({
        url: '/synergy/card/task/publish',
        method: 'post',
        data
    })
}

// 批量取消发布
export function cancelPublish (data) {
    return request({
        url: '/synergy/card/task/unPublish',
        method: 'post',
        data
    })
}

// 导出制证人员基本信息
export function exportAttendeeBase(params) {
    return request({
        url: '/synergy/files/export/card/task/attendee/base',
        method: 'get',
        responseType: 'blob',
        params: params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

