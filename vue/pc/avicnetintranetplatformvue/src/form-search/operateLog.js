/*
 * @Author: aq.hu
 * @Date: 2021-04-09 10:51:01
 * @LastEditTime: 2021-05-17 16:23:14
 * @LastEditors: aq.hu
 * @Description: 操作日志检索项
 */
import {
  input,
  daterange,
  select
} from '@/components/SpForm/utils/createCommonConfig'
import { operateTypes } from './config/customData'

export const operateUser = input('操作人', 'operName', {})
export const operateRole = input('操作人角色', 'roleName', {})
export const operateTime = daterange('操作时间', 'operTime', '', null, true)
export const operateModule = input('访问模块', 'title', {})
export const operateIp = input('IP地址', 'operIp', {})
export const operateDetail = input('操作详情包括', 'detail', {})
export const operateType = select('操作类型', 'businessType', operateTypes, {})
export const operateDesc = input('描述信息包括', 'errorMsg', {})
