/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:30
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-31 10:02:05
 */
import { getDicts } from '@/api/system/dict/data'
import {
  select,
  input,
  dateRange
} from '@/utils/extends/form/utils/createCommonConfig'
// import { AUDIT_STATUS } from './utils/static_options'

export const userName = input('用户名称', 'userName')
export const phonenumber = input('手机号码', 'phonenumber')
export const userStatus = select('状态', 'status', {
  apiMethod: getDicts('sys_normal_disable'),
  label: 'dictLabel',
  value: 'dictValue',
  data: 'data'
})
export const dateRangeValue = dateRange('创建时间', 'dateRange', 'yyyy-MM-dd')
