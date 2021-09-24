import {
  input, select, daterange
} from '@/components/SpForm/utils/createCommonConfig'

export const ipaddr = input('登录地址', 'ipaddr')

export const userName = input('用户名称', 'userName')

export const jobName = input('任务名称', 'jobName')

export const jobGroup = select('任务名称', 'jobGroup', {
  api: 'common.sys_job_group',
  label: 'dictLabel',
  value: 'dictValue',
  data: 'data'
})

export const jobStatus = select('任务状态', 'jobStatus', {
  api: 'common.sys_job_status',
  label: 'dictLabel',
  value: 'dictValue',
  data: 'data'
})

export const jobTimeRange = daterange('执行时间:', 'timeRange', '', null, true)
