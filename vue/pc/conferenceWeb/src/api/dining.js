import request from '@/utils/request'
import Qs from 'qs'




//用餐任务导出
export function exportTask (params) {
    return request({
        url: '/synergy/files/export/dining/task',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

//用餐任务导出
export function exportDining (params) {
    return request({
        url: '/synergy/files/export/dining',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

//获取导入用餐任务结果
export function getImportDiningTaskResult (data) {
    return request({
        url: '/synergy/files/import/dining/task/result',
        method: 'post',
        data
    })
}


//获取导入餐厅结果
export function getImportDiningResult (data) {
    return request({
        url: '/synergy/files/import/dining/result',
        method: 'post',
        data
    })
}

//共享餐厅
export function shareDining (data) {
    return request({
        url: '/synergy/share/share/dining',
        method: 'post',
        data
    })
}

//同步餐厅
export function downDining (data) {
    return request({
        url: '/synergy/share/down/dining',
        method: 'post',
        data
    })
}
export function getDiningList (params) {
    return request({
        url: '/synergy/dining/list',
        method: 'get',
        params
    })
}
export function getDiningById (params) {
    return request({
        url: '/synergy/dining/details',
        method: 'get',
        params
    })
}

export function addDining (data) {
    return request({
        url: '/synergy/dining/insert',
        method: 'post',
        data
    })
}

export function updateDining (data) {
    return request({
        url: '/synergy/dining/update',
        method: 'post',
        data
    })
}

export function newUpdateDining (data) {
    return request({
        url: '/synergy/dining/updatedininginfo',
        method: 'post',
        data
    })
}

export function deleteDining (data) {
    return request({
        url: '/synergy/dining/delete',
        method: 'post',
        data
    })
}

export function getDiningTaskList (params) {
    return request({
        url: '/synergy/dining/task/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getDiningTaskById (params) {
    return request({
        url: '/synergy/dining/task/details',
        method: 'get',
        params
    })
}

export function addDiningTask (data) {
    return request({
        url: '/synergy/dining/task/insert',
        method: 'post',
        data
    })
}

export function copyDiningTask (data) {
    return request({
        url: '/synergy/dining/task/insertcopytask',
        method: 'post',
        data
    })
}

export function updateDiningTask (data) {
    return request({
        url: '/synergy/dining/task/update',
        method: 'post',
        data
    })
}

export function deleteDiningTask (data) {
    return request({
        url: '/synergy/dining/task/delete',
        method: 'post',
        data
    })
}

export function getTaskTypeOptions (params) {
    return request({
        url: '/synergy/dining/typeCodeList',
        method: 'get',
        params
    })
}

export function getDiningByTaskQuery (params) {
    return request({
        url: '/synergy/dining/getDiningByTaskQuery',
        method: 'get',
        params
    })
}

export function cancelDiningTask (data) {
    return request({
        url: '/synergy/dining/task/cancel',
        method: 'post',
        data
    })
}

// 某任务下的参会人列表
export function getDiningTaskAttendeeList (params) {
    return request({
        url: '/synergy/dining/task/attendee/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 用餐人员信息：查询中查询会议下每个人的用车信息用到这接口
export function getAttendeeInfoList (params) {
    return request({
        url: '/synergy/dining/task/attendee/dinner/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
export function deleteDiningTaskAttendee (data) {
    return request({
        url: '/synergy/dining/task/attendee/delete',
        method: 'post',
        data
    })
}

export function addDiningTaskAttendee (data) {
    return request({
        url: '/synergy/dining/task/attendee/insert',
        method: 'post',
        data
    })
}

// 代办  20201219
export function getDiningTaskMeetingList (params) {
    return request({
        url: '/synergy/dining/task/dinner/task/meeting/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function batchPublish (data) {
    return request({
        url: '/synergy/dining/task/publish',
        method: 'post',
        data
    })
}

export function cancelPublish (data) {
    return request({
        url: '/synergy/dining/task/unPublish',
        method: 'post',
        data
    })
}


//查询某个参会人的用餐任务列表
export function getTaskListById (params) {
    return request({
        url: '/synergy/dining/task/attendee/dinner',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}


//桌号修改
export function updateTableNo (data) {
    return request({
        url: '/synergy/dining/task/attendee/update',
        method: 'post',
        data
    })
}