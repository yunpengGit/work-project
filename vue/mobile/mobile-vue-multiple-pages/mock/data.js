import Mock from 'mockjs'

Mock.mock('/rest/inquirePrice/viewSource', {
  'recordsFiltered': 0,
  'recordsTotal': 11,
  'success': false,
  'respCode|1': ['0000'],
  'respDesc': '操作成功',
  'data|5-10': [{
    'openSourceAskDetailBOS|3-6': [
      {
        purchaserName: () => { return Mock.Random.ctitle(3, 20) },
        prodSiginstName: () => { return Mock.Random.cparagraph(3, 20) },
        'buyNum|1-9999': 100,
        'measureName|1': ['个', '件', '吨'],
        'askSheetStatus|1': [0, 1, 2, 3, 4],
        'prodSiginstPropDesc': () => { return Mock.Random.cparagraph() },
        'crtTime': 1576140178309,
        'answerEndTime': 1576140178309
      }
    ],
    'purchaserId|1': [1, 2, 3, 4, 5, 6, 7, 8, 9]
    // purchaserId: Mock.Random.increment()
  }]
})
Mock.mock('/rest/inquirePrice/checkStatistics', { 'respCode': '0000', 'respDesc': '操作成功', 'success': false, 'mdata': 'false' }
)
