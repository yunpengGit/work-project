import request from '@/utils/request'
import Qs from 'qs'


//住宿任务导出
export function exportTask (params) {
    return request({
        url: '/synergy/files/export/room/task',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportHotel (params) {
    return request({
        url: '/synergy/files/export/hotel',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportRoom (params) {
    return request({
        url: '/synergy/files/export/room',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
export function exportRoomForm (params) {
    return request({
        url: '/synergy/files/export/room/form',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}


//获取导入住宿任务结果
export function getImportRoomTaskResult (data) {
    return request({
        url: '/synergy/files/import/room/task/result',
        method: 'post',
        data
    })
}

//获取导入房间结果
export function getImportRoomResult (data) {
    return request({
        url: '/synergy/files/import/room/result',
        method: 'post',
        data
    })
}

//获取导入房型结果
export function getImportRoomFormResult (data) {
    return request({
        url: '/synergy/files/import/room/form/result',
        method: 'post',
        data
    })
}

//获取导入酒店结果
export function getImportHotelResult (data) {
    return request({
        url: '/synergy/files/import/hotel/result',
        method: 'post',
        data
    })
}

//共享房间
export function shareRoom (data) {
    return request({
        url: '/synergy/share/share/room',
        method: 'post',
        data
    })
}

//同步房间
export function downRoom (data) {
    return request({
        url: '/synergy/share/down/room',
        method: 'post',
        data
    })
}

//共享房型
export function shareModel (data) {
    return request({
        url: '/synergy/share/share/room/model',
        method: 'post',
        data
    })
}

//同步房型
export function downModel (data) {
    return request({
        url: '/synergy/share/down/room/model',
        method: 'post',
        data
    })
}

//共享酒店
export function shareHotel (data) {
    return request({
        url: '/synergy/share/share/room/hotel',
        method: 'post',
        data
    })
}

//同步酒店
export function downHotel (data) {
    return request({
        url: '/synergy/share/down/room/hotel',
        method: 'post',
        data
    })
}

export function getHotelList (params) {
    return request({
        url: '/synergy/hotel/list',
        method: 'get',
        params
    })
}
export function getHotelById (params) {
    return request({
        url: '/synergy/hotel/details',
        method: 'get',
        params
    })
}

export function addHotel (data) {
    return request({
        url: '/synergy/hotel/insert',
        method: 'post',
        data
    })
}

export function updateHotel (data) {
    return request({
        url: '/synergy/hotel/update',
        method: 'post',
        data
    })
}

export function deleteHotel (data) {
    return request({
        url: '/synergy/hotel/delete',
        method: 'post',
        data
    })
}

export function getRoomFormList (params) {
    return request({
        url: '/synergy/roomForm/list',
        method: 'get',
        params
    })
}
export function getRoomFormById (params) {
    return request({
        url: '/synergy/roomForm/details',
        method: 'get',
        params
    })
}

export function addRoomForm (data) {
    return request({
        url: '/synergy/roomForm/insert',
        method: 'post',
        data
    })
}

export function updateRoomForm (data) {
    return request({
        url: '/synergy/roomForm/update',
        method: 'post',
        data
    })
}

export function deleteRoomForm (data) {
    return request({
        url: '/synergy/roomForm/delete',
        method: 'post',
        data
    })
}

export function getRoomList (params) {
    return request({
        url: '/synergy/room/list',
        method: 'get',
        params
    })
}
export function getRoomById (params) {
    return request({
        url: '/synergy/room/details',
        method: 'get',
        params
    })
}

export function addRoom (data) {
    return request({
        url: '/synergy/room/insert',
        method: 'post',
        data
    })
}

export function updateRoom (data) {
    return request({
        url: '/synergy/room/update',
        method: 'post',
        data
    })
}

export function deleteRoom (data) {
    return request({
        url: '/synergy/room/delete',
        method: 'post',
        data
    })
}

export function getRoomFormByHotelId (params) {
    return request({
        url: '/synergy/hotel/getRoomFormByHotelId',
        method: 'get',
        params
    })
}

export function getRoomTaskList (params) {
    return request({
        url: '/synergy/room/task/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function roomTaskInsert (data) {
    return request({
        url: '/synergy/room/task/insert',
        method: 'post',
        data
    })
}

export function getAttendeeInfoList (params) {
    return request({
        url: '/synergy/room/task/attendee/room/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getAttendeeInRoomList (params) {
    return request({
        url: '/synergy/room/task/attendee',
        method: 'get',
        params
    })
}

export function deleteAttendeeInRoom (data) {
    return request({
        url: '/synergy/room/task/delete',
        method: 'post',
        data
    })
}

// 住房分配参会人列表
export function getSynergyAttendeeTask (params) {
    return request({
        url: 'synergy/room/task/room/task/meeting/list',
        method: 'get',
        params
    })
}

// 会议id查详情
export function getSynergyDetail (params) {
    return request({
        url: 'conference/details',
        method: 'get',
        params
    })
}
//批量发布
export function batchPublish (data) {
    return request({
        url: '/synergy/room/task/publish',
        method: 'post',
        data
    })
}
//批量取消发布
export function cancelPublish (data) {
    return request({
        url: '/synergy/room/task/unPublish',
        method: 'post',
        data
    })
}
