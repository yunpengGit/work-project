/*
 * @Descripttion:通讯录检索项
 * @Author: zongmz
 * @Date: 2021-03-22 09:46:08
 * @LastEditors: zongmz
 * @LastEditTime: 2021-03-25 16:03:28
 */
import {
  input
} from '@/components/SpForm/utils/createCommonConfig'
export const searchValue = input('关键词：', 'searchValue', null, '姓名/职务/电话')
