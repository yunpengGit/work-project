/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-21 16:19:15
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-15 15:50:12
 */
import request from '@/utils/request'
import Qs from 'qs'

// 获取审核列表
export function getConferenceVerifyReason(data) {
    return request({
        url: '/attendeeManage/getConferenceVerifyReason',
        method: 'GET',
        params: data
    })
}
// 修改审核列表默认信息
export function editConferenceVerifyReason(data) {
    return request({
        url: '/attendeeManage/updateConferenceVerifyReason',
        method: 'GET',
        params: data
    })
}
// 获取标签颜色列表
export function getColors(data) {
    return request({
        url: '/conferenceTag/getColorList',
        method: 'GET',
        params: data
    })
}
// 获取联络人管理角色
export function getRoles(data) {
    return request({
        url: '/dictionary/contacterRole/dictionaryValue',
        method: 'GET',
        params: data
    })
}
// 获取标签列表
export function getTags(data) {
    return request({
        url: '/conferenceTag/getList',
        method: 'GET',
        params: data
    })
}
// 获取虚拟手机号码
export function getPhone(data) {
    return request({
        url: `/conference/getMobileNumber`,
        method: 'GET',
        params: data
    })
}

