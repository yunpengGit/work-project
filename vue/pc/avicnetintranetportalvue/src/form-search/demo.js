import {
  select,
  // asyncSelect,
  input,
  // cascader,
  daterange
} from '@/components/SpForm/utils/createCommonConfig'
// import api from '@/api-manage' // 接口方法

export const title = input('标题', 'title')
export const selectO = select('状态', 'select')
export const selectI = select('紧急度', 'select')
export const selectP = select('逾期', 'select')
export const selectU = select('待办类型', 'select')
export const selectY = select('发起人', 'select')
export const selectT = daterange('接收时间', 'selectA', '', {
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
