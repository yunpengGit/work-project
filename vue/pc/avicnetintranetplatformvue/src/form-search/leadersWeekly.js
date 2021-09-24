/*
 * @Descripttion:领导一周检索项
 * @Author: zongmz
 * @Date: 2021-03-25 17:30:23
 * @LastEditors: aq.hu
 * @LastEditTime: 2021-05-11 14:59:58
 */
import {
  select,
  input
} from '@/components/SpForm/utils/createCommonConfig'
import { leaderTypeData } from './config/customData'

export const leaderName = input('领导姓名:', 'leaderName', {}, '请输入')
export const leaderType = select('领导类型:', 'leaderType', leaderTypeData, {})
export const editorName = input('可编辑者:', 'editorName', {}, '请输入')
