/*
 * @Author: caofeng
 * @LastEditors: caofeng
 * @Date: 2021-07-19 17:16:13
 * @LastEditTime: 2021-07-20 17:47:56
 * @FilePath: \conferenceH5e:\项目\内网\avicnetintranetplatformvue\src\form-search\componentManage.js
 */

import {
  input
} from '@/components/SpForm/utils/createCommonConfig'

export const categoryName = input('名称：', 'categoryName', {}, '请输入分类名称')
export const componentName = input('名称：', 'label', {}, '请输入组件名称')

