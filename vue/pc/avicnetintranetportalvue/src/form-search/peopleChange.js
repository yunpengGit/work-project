/*
 * @Author: aq.hu
 * @Date: 2021-03-30 10:13:21
 * @LastEditTime: 2021-05-10 11:21:26
 * @LastEditors: Please set LastEditors
 * @Description:
 */
import {
  select,
  input
} from '@/components/SpForm/utils/createCommonConfig'
import { vacationData } from './config/customData'
import api from '@/api-manage'

export const userName = input('姓名:', 'userName', {}, '请输入姓名')
export const outgoingType = select('类型:', 'outgoingType', vacationData)
export const deptId = {
  model: 'deptId',
  type: 'el-radio',
  options: [],
  init (vm) {
    const defaultOption = [{ label: '不限', value: null }]
    api.request('peopleChange.isAcc').then(res => {
      const arr = res.data.depts.map(v => {
        return { label: v.deptName, value: v.deptId }
      })
      this.options = [...defaultOption, ...arr]
      vm.form.deptId = null
    })
  }
}

