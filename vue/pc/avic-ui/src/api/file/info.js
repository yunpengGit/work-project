import axios from 'axios'
import request from '@/utils/request'
import {resolveBlob} from "../../utils/zipdownload";
import {getToken} from '@/utils/auth'

const baseUrl = process.env.VUE_APP_BASE_API;
const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
};

// 查询文件信息管理列表
export function listInfo(query) {
  return request({
    url: '/file/info/list',
    method: 'get',
    params: query
  })
}

// 查询文件信息管理详细
export function getInfo(id) {
  return request({
    url: '/file/info/' + id,
    method: 'get'
  })
}

// 新增文件信息管理
export function addInfo(data) {
  return request({
    url: '/file/info',
    method: 'post',
    data: data,
    header: {'Content-Type': 'multipart/form-data'}
  })
}

// 修改文件信息管理
export function updateInfo(data) {
  return request({
    url: '/file/info',
    method: 'put',
    data: data
  })
}

// 删除文件信息管理
export function delInfo(id) {
  return request({
    url: '/file/info/' + id,
    method: 'delete'
  })
}

// 下载文件通过ID
export function downloadFileByIds(ids) {
  return axios({
    url: baseUrl + '/file/info/download/' + ids,
    method: 'get',
    responseType: 'blob',
    headers: {'Authorization': 'Bearer ' + getToken()}
  }).then(res => {
    resolveBlob(res, ids.length > 1 ? mimeMap.zip : mimeMap.xlsx)
  })
}

// 下载文件通过业务ID
export function handleDownloadByBusId(id, secretLevel) {
  return axios({
    url: baseUrl + '/file/info/downloadByBusId/' + id,
    method: 'get',
    responseType: 'blob',
    params: secretLevel,
    headers: {'Authorization': 'Bearer ' + getToken()}
  }).then(res => {
    resolveBlob(res, mimeMap.zip)
  })
}

// 下载文件通过业务类型
export function handleDownloadByBusType(busType, secretLevel) {
  return axios({
    url: baseUrl + '/file/info/downloadByBusType/' + busType,
    method: 'get',
    responseType: 'blob',
    params: secretLevel,
    headers: {'Authorization': 'Bearer ' + getToken()}
  }).then(res => {
    resolveBlob(res, mimeMap.zip)
  })
}
