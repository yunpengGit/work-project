
import { type } from './objectType'
export function authorityRouter (asyncAuthority) {
  const isArray = type('Array')
  if (!isArray(asyncAuthority)) {
    return new Error('当前用户权限数据对象类型错误！期望为Array')
  }
  if (asyncAuthority.length < 0) {
    return new Error('当前用户没有权限！')
  }
  // 获取异步请求权限id的list
  const idList = []
  arrayTraversal(asyncAuthority)
  function arrayTraversal(param) {
    param.filter((item) => {
      if (item.id) {
        idList.push(item.id)
      }
      if (item.children && item.children.length > 0) {
        arrayTraversal(item.children)
      }
    })
  }
  return idList
}
