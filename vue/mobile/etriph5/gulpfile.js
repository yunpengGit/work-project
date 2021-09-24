/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-25 11:43:09
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-09 15:54:59
 */

var fs = require('fs')
const gulp = require('gulp')
const GulpSSH = require('gulp-ssh')

const ssh = { // 测试服务器
  host: '10.88.180.114',
  user: 'admin',
  passphrase: '', // 秘钥加密密码
  privateKey: fs.readFileSync('C:/Users/lenovo/.ssh/id_rsa'),
  port: 22
}
const publicPath = './dist/' // 本地程序编译好路径
const remotePath = '/usr/share/nginx/html/' // 部署到服务器的路径

const gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: ssh
})

/**
 * 上传前先删除服务器上现有文件
 */
gulp.task('execSSH', () => {
  return gulpSSH.shell([`rm -rf ${remotePath}`], { filePath: 'commands.log' })
    .pipe(gulp.dest('logs'))
})

/**
 * 上传文件到服务器
 */

gulp.task('deploy', gulp.series('execSSH', done => {
  // setTimeout(() => {
  gulp.src(`${publicPath}**`).pipe(gulpSSH.dest(remotePath))
  done()
  // }, 2000)
}))
