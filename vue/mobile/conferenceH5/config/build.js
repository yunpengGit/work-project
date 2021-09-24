let projectName = process.argv[2]
let fs = require('fs')

fs.writeFileSync('./config/project.js', `exports.name = '${projectName}'`)

// 同步创建子进程
let exec = require('child_process').execSync
exec('npm run build', { stdio: 'inherit' }) // 子进程的stdio从父进程继承
