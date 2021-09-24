/*
 * @Descripttion:资讯栏目栏目检索项
 * @Author: zongmz
 * @Date: 2021-03-22 09:46:08
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-15 17:39:44
 */
import {
  select,
  input,
  daterange
} from '@/components/SpForm/utils/createCommonConfig'

import { columnStatusData, contentStatusData } from './config/customData'
import api from '@/api-manage'

export const columnName = input('名称:', 'name', null, '请输入栏目名称', { min: 4, message: '最小 4 个字符', trigger: 'blur' })
export const columnStatus = select('状态:', 'status', columnStatusData)

export const contentName = input('标题:', 'title', null, '内容标题', { min: 4, message: '最小 4 个字符', trigger: 'blur' })
export const contentTimeRange = daterange('发布时间:', 'timeRange', '', null, true)
export const contentStatus = select('状态:', 'status', contentStatusData)

export const contentColumn = {
  label: '栏目：',
  type: 'el-tree',
  model: 'catalogId',
  options: [],
  isShowTree: false,
  isInit: false,
  showCheckbox: false,
  expandOnClickNode: false,
  checkOnClickNode: true,
  checkStrictly: true,
  props: {
    placeholder: '请选择栏目',
    disabled: false
  },
  init (vm) {
    if (this.isInit) return
    this.isInit = true
    this.props.disabled = true
    api.request('news.catalogsTree', { filterType: 'SELF_MANAGE' }).then(response => {
      this.props.disabled = false
      this.options = response.data
      window.addEventListener('click', () => {
        this.isShowTree = false
      })
    })
    document.addEventListener('focus', () => {
      vm.showTree = false
    })
  }
}
