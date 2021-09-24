import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/conferenceMaterialsGroup/findByConferenceId',
        method: 'GET',
        params: data
    })
}
export function getLogos(data) {
    return request({
        url: '/conferenceMaterialsGroup/materialsGroupLogoList',
        method: 'GET'
    })
}

export function getView(data) {
    return request({
        url: '/conferenceMaterialsGroup/findById?id=' + data.id,
        method: 'GET'
    })
}

export function insert(data) {
    return request({
        url: '/conferenceMaterialsGroup/',
        method: 'POST',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/conferenceMaterialsGroup/update',
        method: 'POST',
        data: data
    })
}

export function deleteBatch(data) {
    return request({
        url: '/conferenceMaterialsGroup/deleteByIds',
        method: 'POST',
        data: data
    })
}

export function getFileList(data) {
    return request({
        url: '/conferenceMaterials/findByConferenceId',
        method: 'GET',
        params: data
    })
}

export function addFile(data) {
    return request({
        url: '/conferenceMaterialsGroup/addFiles',
        method: 'POST',
        data: data
    })
}

export function deleteFileBatch(data) {
    return request({
        url: '/conferenceMaterials/deleteByIds',
        method: 'POST',
        data: data
    })
}

export function changeGroupByIds(data) {
    return request({
        url: '/conferenceMaterials/changeGroupByIds',
        method: 'POST',
        data: data
    })
}

