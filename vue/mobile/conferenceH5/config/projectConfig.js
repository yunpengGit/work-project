/*
 * @Author: your name
 * @Date: 2021-07-05 16:03:00
 * @LastEditTime: 2021-08-11 22:59:12
 * @LastEditors: zhaohx
 * @Description: In User Settings Edit
 * @FilePath: \conferenceH5\config\projectConfig.js
 */
const projectName = require('./project')

const config = {
  // 会务
  conference: {
    pages: {
      index: {
        entry: 'src/projects/conference/main.js',
        template: 'public/index.html',
        filename: 'index.html',
        title: ''
      }
    },
    projectName: 'J07ManageApp2'
  },
  // 参会
  attendee: {
    pages: {
      index: {
        entry: 'src/projects/attendee/main.js',
        template: 'public/index.html',
        filename: 'index.html',
        title: '参会人'
      }
    },
    projectName: 'J07AttendeeApp2'
  },
  // 司机
  driver: {
    pages: {
      index: {
        entry: 'src/projects/driver/main.js',
        template: 'public/index.html',
        filename: 'index.html',
        title: '司机端'
      }
    },
    projectName: 'J07ManageApp1111'
  }
}

const configObj = config[projectName.name]
module.exports = configObj
