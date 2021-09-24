import request from '@/utils/request'
import Qs from 'qs'



export function ifExistTask (params) {
    return request({
        url: '/synergy/vehicle/task/attendees/task/exist',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}


export function exportTask (params) {
    return request({
        url: '/synergy/files/export/vehicle/task',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportType (params) {
    return request({
        url: '/synergy/files/export/vehicle/type',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
export function exportDriver (params) {
    return request({
        url: '/synergy/files/export/vehicle/driver',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function exportVehicle (params) {
    return request({
        url: '/synergy/files/export/vehicle',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}


//公司的导出
export function exportCompany (params) {
    return request({
        url: '/synergy/files/export/vehicle/company',
        method: 'get',
        responseType: 'blob',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

//获取导入公司结果
export function getImportCompanyResult (data) {
    return request({
        url: '/synergy/files/import/vehicle/company/result',
        method: 'post',
        data
    })
}


//获取导入司机结果
export function getImportDriverResult (data) {
    return request({
        url: '/synergy/files/import/vehicle/driver/result',
        method: 'post',
        data
    })
}

//获取导入车型结果
export function getImportCarTypeResult (data) {
    return request({
        url: '/synergy/files/import/vehicle/type/result',
        method: 'post',
        data
    })
}


//获取导入车辆结果
export function getImportCarResult (data) {
    return request({
        url: '/synergy/files/import/vehicle/result',
        method: 'post',
        data
    })
}

//获取导入车辆任务结果
export function getImportCarTaskResult (data) {
    return request({
        url: '/synergy/files/import/vehicle/task/result',
        method: 'post',
        data
    })
}


//修改联系人
export function changeContact (data) {
    return request({
        url: '/synergy/vehicle/task/attendee/update',
        method: 'post',
        data
    })
}



//共享车辆
export function shareCar (data) {
    return request({
        url: '/synergy/share/share/vehicle',
        method: 'post',
        data
    })
}

//同步车辆
export function downCar (data) {
    return request({
        url: '/synergy/share/down/vehicle',
        method: 'post',
        data
    })
}
//共享车型
export function shareType (data) {
    return request({
        url: '/synergy/share/share/vehicle/type',
        method: 'post',
        data
    })
}

//同步车型
export function downType (data) {
    return request({
        url: '/synergy/share/down/vehicle/type',
        method: 'post',
        data
    })
}

//共享司机
export function shareDriver (data) {
    return request({
        url: '/synergy/share/share/vehicle/driver',
        method: 'post',
        data
    })
}

//同步司机 
export function downDriver (data) {
    return request({
        url: '/synergy/share/down/vehicle/driver',
        method: 'post',
        data
    })
}


//共享车辆公司  
export function shareCompany (data) {
    return request({
        url: '/synergy/share/share/vehicle/company',
        method: 'post',
        data
    })
}

//同步车辆公司  
export function downCompany (data) {
    return request({
        url: '/synergy/share/down/vehicle/company',
        method: 'post',
        data
    })
}
export function getVehicleColor (params) {
    return request({
        url: '/dictionary/vehicleColor/dictionaryValue',
        method: 'get',
        params
    })
}
export function getSexOptioin (params) {
    return request({
        url: '/dictionary/sex/dictionaryValue',
        method: 'get',
        params
    })
}

export function getCarList (params) {
    return request({
        url: '/synergy/vehicle/list',
        method: 'get',
        params
    })
}
export function getCarById (params) {
    return request({
        url: '/synergy/vehicle/details',
        method: 'get',
        params
    })
}

export function addCar (data) {
    return request({
        url: '/synergy/vehicle/insert',
        method: 'post',
        data
    })
}

export function updateCar (data) {
    return request({
        url: '/synergy/vehicle/update',
        method: 'post',
        data
    })
}

export function deleteCar (data) {
    return request({
        url: '/synergy/vehicle/delete',
        method: 'post',
        data
    })
}

export function getCompanyList (params) {
    return request({
        url: '/synergy/vehicleCompany/list',
        method: 'get',
        params
    })
}

export function getCompanyById (params) {
    return request({
        url: '/synergy/vehicleCompany/details',
        method: 'get',
        params
    })
}

export function addCompany (data) {
    return request({
        url: '/synergy/vehicleCompany/insert',
        method: 'post',
        data
    })
}

export function updateCompany (data) {
    return request({
        url: '/synergy/vehicleCompany/update',
        method: 'post',
        data
    })
}

export function deleteCompany (data) {
    return request({
        url: '/synergy/vehicleCompany/delete',
        method: 'post',
        data
    })
}

export function getDriverList (params) {
    return request({
        url: '/synergy/driver/list',
        method: 'get',
        params
    })
}

export function getDriverById (params) {
    return request({
        url: '/synergy/driver/details',
        method: 'get',
        params
    })
}

export function addDriver (data) {
    return request({
        url: '/synergy/driver/insert',
        method: 'post',
        data
    })
}

export function updateDriver (data) {
    return request({
        url: '/synergy/driver/update',
        method: 'post',
        data
    })
}

export function deleteDriver (data) {
    return request({
        url: '/synergy/driver/delete',
        method: 'post',
        data
    })
}

export function getVehicleTypeList (params) {
    return request({
        url: '/synergy/vehicleType/list',
        method: 'get',
        params
    })
}

export function getVehicleTypeById (params) {
    return request({
        url: '/synergy/vehicleType/details',
        method: 'get',
        params
    })
}

export function addVehicleType (data) {
    return request({
        url: '/synergy/vehicleType/insert',
        method: 'post',
        data
    })
}

export function updateVehicleType (data) {
    return request({
        url: '/synergy/vehicleType/update',
        method: 'post',
        data
    })
}

export function deleteVehicleType (data) {
    return request({
        url: '/synergy/vehicleType/delete',
        method: 'post',
        data
    })
}

// 接站用车任务和空闲车列表
export function getPickUpVehicleTaskList (data) {
    return request({
        url: '/synergy/vehicle/task/vehicle/task/arrive/vehicle/list',
        method: 'post',
        data
    })
}
// 送站用车任务和空闲车列表
export function getPickOutVehicleTaskList (data) {
    return request({
        url: '/synergy/vehicle/task/vehicle/task/return/vehicle/list',
        method: 'post',
        data
    })
}

export function getVehicleTaskById (params) {
    return request({
        url: '/synergy/vehicle/task/details',
        method: 'get',
        params
    })
}

export function addVehicleTask (data) {
    return request({
        url: '/synergy/vehicle/task/insert',
        method: 'post',
        data
    })
}

export function updateVehicleTask (data) {
    return request({
        url: '/synergy/vehicle/task/update',
        method: 'post',
        data
    })
}

export function deleteVehicleTask (data) {
    return request({
        url: '/synergy/vehicle/task/delete',
        method: 'post',
        data
    })
}

export function cancelVehicleTask (data) {
    return request({
        url: '/synergy/vehicle/task/cancel',
        method: 'post',
        data
    })
}

export function getTaskTypeOptions (params) {
    return request({
        url: '/dictionary/vehicleTaskType/dictionaryValue',
        method: 'get',
        params
    })
}
// 某任务下的参会人列表
export function getVehicleTaskAttendeeList (params) {
    return request({
        url: '/synergy/vehicle/task/attendee/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
export function addVehicleTaskAttendee (data) {
    return request({
        url: '/synergy/vehicle/task/attendee/insert',
        method: 'post',
        data
    })
}

export function deleteVehicleTaskAttendee (data) {
    return request({
        url: '/synergy/vehicle/task/attendee/delete',
        method: 'post',
        data
    })
}
// 查询报名通过的参会人列表 任务下添加参会人中使用
export function getAttendeeList (params) {
    return request({
        url: '/attendeeManage/list/organized',
        method: 'get',
        params
    })
}
// 人员分配中 报名新增 报名变更请假等四个tab页的参会人列表
export function getTaskAttendeeList (params) {
    return request({
        url: '/attendeeManage/task/list/organized',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
// 接站用车
export function getPickUpTaskAttendeeList (params) {
    return request({
        url: '/attendeeManage/task/list/synergyOrganized',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 用车人员查询中查询会议下每个人的用车信息用到这接口
export function getAttendeeInfoList (params) {
    return request({
        url: '/synergy/vehicle/task/attendee/vehicle/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}
//  议程列表
export function getYiChengList (params) {
    return request({
        url: '/conferenceAgenda/queryByConferenceId',
        method: 'get',
        params
    })
}

export function updateTaskState (data) {
    return request({
        url: '/attendeeManage/task/update',
        method: 'post',
        data
    })
}

export function getGroupList (params) {
    return request({
        url: '/conferenceAccompany/list',
        method: 'GET',
        params
    })
}

// 传入司机手机号 判断司机是否已经是商网用户
export function getUserByMobile (params) {
    return request({
        url: '/user/getUserByMobile',
        method: 'GET',
        params
    })
}
//  根据会议id，开始时间，结束时间和车辆类型查询车辆列表
export function getTaskVechicleList (params) {
    return request({
        url: '/synergy/vehicle/task/vehicle/list',
        method: 'GET',
        params
    })
}

export function getAllResourceList (params) {
    return request({
        url: '/synergy/common/synergy/list',
        method: 'GET',
        params
    })
}

export function getVehicleTaskList (params) {
    return request({
        url: '/synergy/vehicle/task/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function getToDoNum (params) {
    return request({
        url: '/attendeeManage/task/count/synergyOrganized',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 代办中会议用车列表
export function getMeetingList (params) {
    return request({
        url: 'synergy/vehicle/task/vehicle/task/meeting/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 代办中会议用车任务列表
export function getMeetingTaskList (params) {
    return request({
        url: 'synergy/vehicle/task/vehicle/task/meeting/vehicle/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function ignoreTask (data) {
    return request({
        url: '/attendeeManage/task/updateForSynergy',
        method: 'post',
        data
    })
}

// 接站用车分配参会人列表   mingjia 20201218
export function getPickUpAttendeeList (params) {
    return request({
        url: '/synergy/vehicle/task/vehicle/task/arrive/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

// 送站用车分配参会人列表    mingjia 20201218
export function getPickOutAttendeeList (params) {
    return request({
        url: '/synergy/vehicle/task/vehicle/task/return/list',
        method: 'get',
        params,
        paramsSerializer: function (params) {
            return Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    })
}

export function batchPublish (data) {
    return request({
        url: '/synergy/vehicle/task/publish',
        method: 'post',
        data
    })
}

export function cancelPublish (data) {
    return request({
        url: '/synergy/vehicle/task/unPublish',
        method: 'post',
        data
    })
}

export function getCarTaskById (params) {
    return request({
        url: '/synergy/vehicle/task/detail',
        method: 'get',
        params
    })
}