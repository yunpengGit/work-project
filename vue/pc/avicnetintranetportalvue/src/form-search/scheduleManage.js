/*
 * @Author: your name
 * @Date: 2021-04-25 17:00:19
 * @LastEditTime: 2021-05-13 09:22:09
 * @LastEditors: aq.hu
 * @Description: In User Settings Edit
 * @FilePath: \avicnetintranetportalvue\src\form-search\scheduleManage.js
 */
import {
  select,
  input,
  daterange
} from '@/components/SpForm/utils/createCommonConfig'

export const labelNameLike = input('分类名称：', 'labelNameLike', null, '请输入分类名称')
export const statusesIn = select('状态：', 'statusesIn', [
  {
    label: '启用',
    value: 'ENABLED'
  },
  {
    label: '停用',
    value: 'DISABLED'
  }
])
export const sharerUserNameLike1 = input('分享人：', 'sharerUserNameLike', null, '请输入分享人姓名查询')

export const subjectLike = input('标题：', 'subjectLike', null, '请输入标题查询')
export const ownerNameLike = input('拥有者：', 'ownerNameLike', null, '请输入拥有者姓名查询')
export const labelIdsIn = select('日程类型：', 'labelIdsIn', {
  api: 'schedule.getLabels',
  label: 'name',
  value: 'id',
  data: 'data',
  isAll: true
})
export const authorityTypesIn = select('公开范围：', 'authorityTypesIn', [
  {
    label: '分享可见',
    value: 'DEFAULT'
  },
  {
    label: '私密',
    value: 'PRIVATE'
  }
])
export const creatorNameLike = input('创建人：', 'creatorNameLike', null, '请输入创建人姓名查询')
export const dateFrom = daterange('创建时间:', 'dateFrom', '', {
  shortcuts: [
    {
      text: '近一周',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '近一个月',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '近三个月',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '近半年',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '近一年',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}, true)
