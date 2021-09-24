/*
 * @Author: aq.hu
 * @Date: 2021-04-09 10:28:07
 * @LastEditTime: 2021-05-11 15:19:30
 * @LastEditors: aq.hu
 * @Description: 登录日志检索项
 */
import {
  input,
  daterange
} from '@/components/SpForm/utils/createCommonConfig'

export const loginUser = input('登录人', 'nickName', {})
export const loginRole = input('登录人角色', 'roleName', {})
export const accessTime = daterange('登录时间', 'accessTime', '', null, true)
export const desc = input('描述信息包含', 'msg', {})
export const loginIp = input('登录IP', 'ipaddr', {})
