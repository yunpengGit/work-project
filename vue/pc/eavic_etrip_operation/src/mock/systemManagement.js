import Mock from 'mockjs'
import { builder, getBody } from './util'

const getListByParams = () => {
  const totalCount = 100
  // const parameters = getQueryParameters(options)
  const model = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    model.push({
      id: tmpKey,
      key: tmpKey,
      name: '管理员',
      subordinateSystem: '',
      state: Mock.mock('@integer(0, 1)'),
      ipFilterState: '',
      createId: Mock.Random.id(),
      createName: Mock.Random.cname(),
      createTime: Mock.Random.datetime('y-MM-dd HH:mm:ss'),
      updateName: Mock.Random.cname(),
      updateId: Mock.Random.id(),
      updateTime: Mock.Random.datetime('y-MM-dd HH:mm:ss')
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: model
  })
}
Mock.mock(/api\/limit\/limit\/employee\/login/, 'post', getListByParams)
