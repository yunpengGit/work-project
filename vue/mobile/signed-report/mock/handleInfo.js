import Mock from 'mockjs'

// 集团领导传阅
Mock.mock('/km/imissive/km_imissive_lader/kmImissiveLader.do?method=getLaders',
  {
    status: '1',
    sum: 10,
    'data|10': [{
      'id|1': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      // id: () => Mock.Random.increment(),
      'name': () => Mock.Random.first(), // 配置表名称(必填)
      'staffing': () => Mock.Random.first() + '员', // 配置表名称(必填)
      'later': () => Mock.Random.cname(), // 领导姓名(必填)
      'secretary': () => Mock.Random.cname(), // 秘书姓名(必填)
      'photo': () => Mock.Random.image() // 领导头像图片地址(非必填)
    }]
  }
)
// 子公司领导传阅
Mock.mock('/km/imissive/km_company_lader/kmCompanyLader.do?method=getCompanys',
  {
    status: '1',
    sum: 10,
    'data|10': [{
      'id|1': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      // id: () => Mock.Random.increment(),
      'name': () => Mock.Random.first(), // 配置表名称(必填)
      'staffing': () => Mock.Random.first() + '员', // 配置表名称(必填)
      'later': () => Mock.Random.cname(), // 领导姓名(必填)
      'secretary': () => Mock.Random.cname(), // 秘书姓名(必填)
      'photo': () => Mock.Random.image() // 领导头像图片地址(非必填)
    }]
  }
)
// 本部门办理、传阅

Mock.mock('/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getOrg',
  // {
  //   'status': '1',
  //   'sum': '10',
  //   'data|10': [{
  //     'uid': () => Mock.Random.guid(),
  //     'parentNames': '华夏基金_雅昌文化集团_测试部门1',
  //     'orgType|1': ['2', '8'],
  //     'id': () => Mock.Random.increment() + '',
  //     'staffingLevel': '',
  //     'name|1': [() => Mock.Random.cname() + '部门', () => Mock.Random.cname()],
  //     'img': () => Mock.Random.image(),
  //     'isAvailable': 'true',
  //     'parentName': '测试部门1',
  //     'info': '视频（人员） - 华夏基金_雅昌文化集团_测试部门1'
  //   }]
  // }
  {
    'status': '1',
    'data|1': [[{
      'uid': 'shipin1', 'parentNames': '华夏基金_雅昌文化集团_测试部门1', 'orgType': '8', 'id': '16d5bcbf30ab8a8dfa33ea241608548e', 'staffingLevel': '', 'name': '视频', 'img': '/sys/person/image.jsp?personId=16d5bcbf30ab8a8dfa33ea241608548e&size=null', 'isAvailable': 'true', 'parentName': '测试部门1', 'info': '视频（人员） - 华夏基金_雅昌文化集团_测试部门1' }, { 'parentNames': '华夏基金_雅昌文化集团_测试部门1', 'orgType': '2', 'id': '16d43c7dd62fc98a25b81a049d29840e', 'name': '部门领导', 'isAvailable': 'true', 'parentName': '测试部门1', 'info': '部门领导（部门） - 华夏基金_雅昌文化集团_测试部门1'
    }],
    [{
      'uid': 'yg', 'parentNames': '华夏基金_雅昌文化集团_测试部门1_部门领导', 'orgType': '8', 'id': '16d7842499e36840748a4104390a563d', 'staffingLevel': '', 'name': '员工', 'img': '/sys/person/image.jsp?personId=16d7842499e36840748a4104390a563d&size=null', 'isAvailable': 'true', 'parentName': '部门领导', 'info': '员工（人员） - 华夏基金_雅昌文化集团_测试部门1_部门领导' }, { 'uid': 'admin', 'parentNames': '华夏基金_雅昌文化集团_测试部门1_部门领导', 'orgType': '8', 'id': '1183b0b84ee4f581bba001c47a78b2d9', 'staffingLevel': '集团领导', 'name': '管理员', 'img': '/sys/person/image.jsp?personId=1183b0b84ee4f581bba001c47a78b2d9&size=null&s_time=1581309077000', 'isAvailable': 'true', 'parentName': '部门领导', 'info': '管理员（人员） - 华夏基金_雅昌文化集团_测试部门1_部门领导' }, { 'uid': 'bmjl', 'parentNames': '华夏基金_雅昌文化集团_测试部门1_部门领导', 'orgType': '8', 'id': '16d7841ce1b4af2c81dfafc4132b7bb6', 'staffingLevel': '总助级领导', 'name': '部门经理', 'img': '/sys/person/image.jsp?personId=16d7841ce1b4af2c81dfafc4132b7bb6&size=null', 'isAvailable': 'true', 'parentName': '部门领导', 'info': '部门经理（人员） - 华夏基金_雅昌文化集团_测试部门1_部门领导'
    }]],
    'sum': 2
  }
)
// 其他部门办理、传阅
Mock.mock('/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getStaffs',
  {
    'status': '1',
    sum: 10,
    'data|10': [{
      'id': () => Mock.Random.increment() + '', // 主键(必填)
      'name': '文书配置表1', // 配置表名称(必填)
      'dept': () => Mock.Random.cname() + '部门', // 部门名称(必填)
      'staff': () => Mock.Random.cname()// 文书姓名(必填)
    }]
  }
)
// 子公司 其他部门办理、传阅
Mock.mock('/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=getAllOrg',
  // {
  //   'status': '1',
  //   'sum': '10',
  //   'data|10': [{
  //     'uid': () => Mock.Random.guid(),
  //     'parentNames': '华夏基金_雅昌文化集团_测试部门1',
  //     'orgType|1': ['1', '2', '8'],
  //     'id': () => Mock.Random.increment() + '',
  //     'staffingLevel': '',
  //     'name|1': [() => Mock.Random.cname() + '部门', () => Mock.Random.cname()],
  //     'img': () => Mock.Random.image(),
  //     'isAvailable': 'true',
  //     'parentName': '测试部门1',
  //     'info': '视频（人员） - 华夏基金_雅昌文化集团_测试部门1'
  //   }]
  // }
  { 'status': '1', 'data': [{ 'parentNames': '华夏基金', 'orgType': '1', 'id': '16d43c7a543ed5ca5965cce4f61a8be7', 'name': '雅昌文化集团', 'isAvailable': 'true', 'parentName': '华夏基金', 'info': '雅昌文化集团（机构） - 华夏基金' }], 'sum': 1 }
)
Mock.mock('/km/imissive/km_imissive_staff/kmImissiveStaff.do?method=searchOrg',
  // {
  //   'status': '1',
  //   'sum': '10',
  //   'data|10': [{
  //     'uid': () => Mock.Random.guid(),
  //     'parentNames': '华夏基金_雅昌文化集团_测试部门1',
  //     'orgType|1': ['1', '2', '8'],
  //     'id': () => Mock.Random.increment() + '',
  //     'staffingLevel': '',
  //     'name|1': [() => Mock.Random.cname() + '部门', () => Mock.Random.cname()],
  //     'img': () => Mock.Random.image(),
  //     'isAvailable': 'true',
  //     'parentName': '测试部门1',
  //     'info': '视频（人员） - 华夏基金_雅昌文化集团_测试部门1'
  //   }]
  // }
  { 'status': '1', 'data': [{ 'parentNames': '华夏基金', 'orgType': '1', 'id': '16d43c7a543ed5ca5965cce4f61a8be7', 'name': '雅昌文化集团', 'isAvailable': 'true', 'parentName': '华夏基金', 'info': '雅昌文化集团（机构） - 华夏基金' }], 'sum': 1 }
)
