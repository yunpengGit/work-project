import Mock from 'mockjs'

// 集团领导传阅
Mock.mock('/sys/notify/sys_notify_todo/sysNotifyMainIndex.do?method=query&dataType=todo&fdType=13&pageno=1&rowsize=15&orderby=fdCreateTime&ordertype=down&q.from=imissive',
  {
    status: '1',
    sum: 10,
    'data|10': [
      {
        subject: Mock.Random.paragraph(),
        time: Mock.Random.datetime('yyyy-MM-dd'),
        'staffing': () => Mock.Random.first(),
        name: () => Mock.Random.cname(),
        'category|1': Mock.Random.paragraph(3, 5),
        node: Mock.Random.first(),
        'photo': () => Mock.Random.image()
      }
    ]
  }
)
Mock.mock('/sys/notify/sys_notify_todo/sysNotifyMainIndex.do?method=query&dataType=toview&fdType=2&pageno=1&rowsize=15&orderby=fdCreateTime&ordertype=down&q.from=imissive',
  {
    status: '1',
    sum: 10,
    'data|10': [
      {
        subject: Mock.Random.paragraph(),
        time: Mock.Random.datetime('yyyy-MM-dd'),
        'staffing': () => Mock.Random.first(),
        name: () => Mock.Random.cname(),
        'category|1': Mock.Random.paragraph(3, 5),
        node: Mock.Random.first(),
        'photo': () => Mock.Random.image()
      }
    ]
  }
)
