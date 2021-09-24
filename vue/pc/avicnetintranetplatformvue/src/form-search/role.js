/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-11 11:14:32
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-14 10:53:38
 */
import {
  input,
  daterange
} from '@/components/SpForm/utils/createCommonConfig'

export const roleManagerUserName = input('角色名称', 'roleName')
export const roleManagerCreatedTime = daterange('创建时间:', 'timeStamp', null, true)
export const roleManagerRoleNotes = input('角色备注', 'remark')
