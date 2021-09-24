/*
 * @Author: your name
 * @Date: 2021-07-05 16:03:00
 * @LastEditTime: 2021-07-05 17:48:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \conferenceH5\config\dev.js
 */
let projectName = process.argv[2]

let fs = require('fs')

fs.writeFileSync('./config/project.js', `exports.name = '${projectName}'`)

let exec = require('child_process').execSync
exec('npm run serve', { stdio: 'inherit' })
