/*
 * @Descripttion:通知公告检索项
 * @Author: zongmz
 * @Date: 2021-03-22 09:46:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-07 19:28:15
 */
import {
  input,
  daterange,
  select
} from '@/components/SpForm/utils/createCommonConfig'
import { noticeStatusData } from './config/customData'
export const noticeTitle = input('', 'title', { 'prefix-icon': 'el-icon-search' }, '输入标题进行搜索')
export const noticeTimeRange = daterange('日期', 'timeRange', '', {
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
export const noticeStatus = select('状态', 'auditStatus', noticeStatusData)
