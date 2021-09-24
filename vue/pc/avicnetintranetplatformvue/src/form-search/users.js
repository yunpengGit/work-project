import {
  input,
  select
} from '@/components/SpForm/utils/createCommonConfig'
import { userState, userType } from './config/customData'

export const userName = input('用户姓名', 'userName', {}, '请输入姓名')
export const phonenumber = input('手机号', 'phonenumber', {}, '请输入手机号')
export const status = select('账户状态', 'status', userState, {})
export const workNo = input('人员编码', 'workNo', {}, '请输入人员编码')
export const userCompany = input('所属企业', 'sysUserCompanyId', {}, '请输入所属企业')
export const secretLevel = select('M级', 'secretLevel', {
  api: 'users.mType',
  label: 'dictLabel',
  value: 'dictValue',
  data: 'data',
  isAll: true
}, {})
export const type = select('员工类型', 'type', userType, {})
