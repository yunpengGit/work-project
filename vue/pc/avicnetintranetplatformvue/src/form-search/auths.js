/*
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-04-29 19:04:29
 * @LastEditors: caofeng
 * @LastEditTime: 2021-08-20 16:44:53
 */
import {
  input
} from '@/components/SpForm/utils/createCommonConfig'

export const authRoleName = input('角色名称', 'roleName', {})
export const authRemark = input('角色备注', 'remark', {})

export const authNickName = input('姓名', 'nickName', {})
export const authUserName = input('登录名', 'userName', {})

export const authPhone = input('手机号', 'phone', {})
export const authWorkNo = input('员工编号', 'workNo', {})
export const authCompanyName = input('所属企业', 'companyName', {})

