import Mock from 'mockjs'
import { builder, getBody } from './util'

const info = (options) => {
  console.log('options', options)
  const userInfo = {
    id: '4291d7da9005377ec9aec4a71ea837f',
    name: '测试数据',
    username: 'admin',
    password: '',
    avatar: require('./../assets/head.jpg'),
    status: 1,
    telephone: '',
    lastLoginIp: '10.1.11.12',
    lastLoginTime: 1534837621348,
    creatorId: 'admin',
    createTime: 1497160610259,
    merchantCode: 'TLif2btpzg079h15bk',
    deleted: 0,
    roleId: 'admin',
    role: [1, 2, 3]
  }
  // return builder(userInfo)
  const roleObj = {
    id: 'admin',
    name: '管理员',
    describe: '拥有所有权限',
    status: 1,
    creatorId: 'system',
    createTime: 1497160610259,
    deleted: 0,
    permissions: [{
      roleId: 'admin',
      permissionId: 'systemManagement',
      permissionName: '系统管理'
    }]
  }
  userInfo.role = roleObj
  return builder(userInfo)
}
// const username = ['admin', 'test']
// const password = ['21232f297a57a5a743894a0e4a801fc3'] // admin

const login = (options) => {
  const body = getBody(options)
  console.log('mock: body', body)
  // if (!username.includes(body.username) || !password.includes(body.password)) {
  //   return builder({ isLogin: true }, '账户或密码错误', 401)
  // }
  return builder({
    employee: {
      id: Mock.mock('@guid'),
      username: 'admin',
      password: '',
      ssoUserId: '',
      name: Mock.mock('@name'),
      firstName: '',
      lastName: '',
      freezeState: '',
      avatarPath: '',
      mobile: '',
      email: '',
      supplierId: '',
      categoryId: '',
      personId: '',
      ipFilterState: '',
      accountType: '',
      createId: '',
      createTime: '',
      updateId: '',
      updateTime: '',
      deleteId: '',
      deleteTime: ''
    },
    limitgroupList: [
      {
        id: '',
        name: '',
        path: '',
        description: '',
        parentId: '',
        priority: '',
        uniqueUuid: '',
        createId: '',
        createTime: '',
        updateId: '',
        updateTime: '',
        deleteId: '',
        deleteTime: ''
      }
    ],
    avatar: '',
    token: '4291d7da9005377ec9aec4a71ea837f'
  }, '', 200, { 'Custom-Header': Mock.mock('@guid') })
}
const logout = () => {
  return builder({}, '[测试接口] 注销成功')
}
Mock.mock(/user\/info/, 'get', info)
Mock.mock(/api\/employee\/employee\/login/, 'get', login)
Mock.mock(/logout/, 'post', logout)
