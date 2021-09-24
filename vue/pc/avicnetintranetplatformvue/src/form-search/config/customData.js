/*
 * @Descripttion: 自定义数据
 * @Author: zongmz
 * @Date: 2021-03-22 10:06:28
 * @LastEditors: aq.hu
 * @LastEditTime: 2021-05-17 16:21:25
 */

export const columnStatusData = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '未启用',
    value: 0
  },
  {
    label: '已启用',
    value: 1
  }
]

export const contentStatusData = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '未发布',
    value: 0
  },
  {
    label: '已发布',
    value: 1
  }
]

export const isOverDueData = [
  {
    label: '全部',
    value: null
  },
  {
    label: '临期',
    value: 2
  },
  {
    label: '逾期',
    value: 1
  },
  {
    label: '正常',
    value: 0
  }
]

export const vacationData = [
  {
    value: null,
    label: '全部'
  },
  {
    value: 1,
    label: '市外出差'
  }, {
    value: 2,
    label: '外出开会'
  }, {
    value: 3,
    label: '市内办事'
  }, {
    value: 4,
    label: '休假请假'
  }
]

export const statusData = [
  { label: '不限', value: '' },
  { label: '显示', value: '1' },
  { label: '隐藏', value: '0' }
]

export const noticeStatusData = [
  { label: '不限', value: '' },
  { label: '驳回', value: '2' },
  { label: '草稿', value: '1' },
  { label: '待审核', value: '3' },
  { label: '已发布', value: '4' },
  { label: '已取消', value: '5' }
]

export const leaderTypeData = [
  { label: '全部', value: '' },
  { label: '集团领导', value: '1' },
  { label: '总助级高管', value: '10' },
  { label: '部门领导', value: '20' }
]

export const userState = [
  { label: '全部', value: '' },
  { label: '正常', value: 0 },
  { label: '停用', value: 1 }
]

export const userType = [
  { label: '全部', value: '' },
  { label: '正式员工', value: 3 },
  { label: '专项', value: 2 },
  { label: '其他', value: 1 }
]

export const operateTypes = [
  { label: '全部', value: '' },
  { label: '其他', value: 0 },
  { label: '新增', value: 1 },
  { label: '修改', value: 2 },
  { label: '删除', value: 3 },
  { label: '授权', value: 4 },
  { label: '导出', value: 5 },
  { label: '导入', value: 6 },
  { label: '强退', value: 7 },
  { label: '生成代码', value: 8 },
  { label: '清空数据', value: 9 },
  { label: '下载', value: 10 }
]
