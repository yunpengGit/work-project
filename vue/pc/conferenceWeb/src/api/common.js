import request from '@/utils/request'

export function getDicList(data) {
    return request({
        url: '/dictionary/' + data.code + '/dictionaryValue',
        method: 'GET'
    })
}

export function uploadFile(data) {
    return request({
        url: '/files/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'

        },
        data: data
    })
}

export function getFilePath(data) {
    return request({
        url: '/files/getDownloadUrl?filePath=' + data,
        method: 'GET'
    })
}

export function downloadFile(param) {
    return request({
        url: '/files/download',
        method: 'get',
        responseType: 'blob',
        params: param
    })
}
