/*
 * @Author: your name
 * @Date: 2020-01-13 13:57:50
 * @LastEditTime: 2020-11-27 17:16:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \m\mock\scheduleData.js
 */
import Mock from 'mockjs'

Mock.mock('/api/km/calendar/km_calendar_main/kmCalendarMain.do', {
  respCode: '0000', // 成功
  msg: '请求成功',
  'isAfter': true, // true今天之后，false今天之前
  afterEndDay: '', // 向后的开始日期
  beforeEndDay: '', // 向前的开始日期
  startDay: () => { return Mock.Random.date() }, // 开始日期
  num: 10, // 查出多少天
  'data|5': [{
    day: () => { return Mock.Random.date() }, // 当前日期
    'isToday|1': [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false], // 是否为今天
    'list|1-3': [
      {
        startTime: () => { return Mock.Random.time('HH:mm') },
        endTime: () => { return Mock.Random.time('HH:mm') },
        title: () => { return Mock.Random.ctitle(3, 50) },
        'isMobile|1': ['1', '0', '2'], // true全天，false时间段
        'isAllDay|1': [true, false], // true全天，false时间段
        'isSelf|1': [true, false], // true自己，false共享
        'user|1': ['我', () => { return Mock.Random.cname() }],
        link: 'baidu.com',
        'address|1': ['', '这是一段测试内容这是一段测试内容这是一段测试内容这是一段测试内容']
        // 'address|1': ['', () => { return Mock.Random.city(true) }]
      }
    ]
  }]
})
