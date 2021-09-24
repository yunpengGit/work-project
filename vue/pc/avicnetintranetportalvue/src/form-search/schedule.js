/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-22 17:20:07
 * @LastEditors: zongmz
 * @LastEditTime: 2021-05-31 16:12:12
 */
import {
  select,
  input
} from '@/components/SpForm/utils/createCommonConfig'
import api from '@/api-manage'
import { getItem } from '@/utils/storage'

export const permsOwnerIdEqual = {
  label: '权限所有人：',
  type: 'el-select',
  model: 'permsOwnerIdEqual',
  options: [],
  init (vm) {
    api.request('schedule.getEventAuthAsSubscriber', { permsTypesIn: 'READWRITE' }).then(response => {
      this.options = []
      response.data.forEach(ele => {
        this.options.push({
          label: ele.sharerUserName,
          value: ele.sharerId
        })
      })
      const userInfo = JSON.parse(getItem('userInfo'))
      this.options.unshift({
        label: userInfo.nickName,
        value: userInfo.userId
      })
    })
  }
}

export const sharerUserNameLike = input('拥有者：', 'sharerUserNameLike', null, '请输入拥有者')
export const subscriberUserNameLike = input('分享人员：', 'subscriberUserNameLike', null, '请输入分享人员')
export const permsType = select('权限：', 'latestPermsTypesIn', [
  {
    label: '可查看',
    value: 'READONLY'
  },
  {
    label: '可创建、编辑、查看',
    value: 'READWRITE'
  }
])
