/*
 * @Descripttion:待办检索项
 * @Author: zongmz
 * @Date: 2021-03-22 09:46:08
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-30 20:24:37
 */
import {
  input,
  daterange,
  select
  // radioDiy
} from '@/components/SpForm/utils/createCommonConfig'

import {
  isOverDueData
  // statusData
} from './config/customData'
export const searchKey = input('', 'searchKey', { 'prefix-icon': 'el-icon-search' }, '输入标题或发起人进行搜索')
// export const searchKey = input('标题', 'searchKey', '输入标题或发起人进行搜索')
export const todoTitle = input('标题:', 'todoTitle', '请输入')
export const createUserName = input('发起人:', 'createUserName', '请输入')
// export const showState = radioDiy('状态', 'showState', statusData)
// export const overDueFlag = radioDiy('逾期', 'overDueFlag', isOverDueData)
// export const urgentLevel = radioDiy('紧急度', 'urgentLevel', {
//   api: 'doAndRead.urgentLevel',
//   label: 'dictLabel',
//   value: 'dictValue',
//   data: 'data',
//   isAll: true
// })
// export const businessType = radioDiy('类型', 'businessType', {
//   api: 'doAndRead.business',
//   label: 'item',
//   value: 'item',
//   data: 'data',
//   isAll: true
// })
export const timeRange = daterange('接收日期', 'timeRange', '', {
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
export const urgentLevel = select('紧急度', 'urgentLevel', {
  api: 'doAndRead.urgentLevel',
  label: 'dictLabel',
  value: 'dictValue',
  data: 'data',
  isAll: true
}, { class: 'el-select w120' })
export const businessType = select('类型', 'businessType', {
  api: 'doAndRead.business',
  label: 'item',
  value: 'item',
  data: 'data',
  isAll: true
}, { class: 'el-select w120' })
export const overDueFlag = select('逾期', 'overDueFlag', isOverDueData, { class: 'el-select w120' })
export const timeRanges = daterange('办理日期', 'timeRange', '', {
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

