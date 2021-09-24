var fs = require('fs')
const gulp = require('gulp')
const GulpSSH = require('gulp-ssh')

const ssh = { // 测试服务器
  host: '10.88.180.106',
  user: 'admin',
  passphrase: '1088180106', // 秘钥加密密码
  privateKey: fs.readFileSync('C:/Users/Admin/.ssh/id_rsa_etrip'),
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
  gulp.src(`${publicPath}**`).pipe(gulpSSH.dest(remotePath))
  done()
}))
