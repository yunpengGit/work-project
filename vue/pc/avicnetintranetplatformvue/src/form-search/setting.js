/*
 * @Author: aq.hu
 * @Date: 2021-04-09 09:14:20
 * @LastEditTime: 2021-04-12 17:43:29
 * @LastEditors: aq.hu
 * @Description: 日志设置表单搜索项
 */
import {
  daterange
} from '@/components/SpForm/utils/createCommonConfig'

export const dumpTime = daterange('转储时间', 'dumpTime', '', null, true)
export const logTime = daterange('日志时间', 'logTime', '', null, true)
