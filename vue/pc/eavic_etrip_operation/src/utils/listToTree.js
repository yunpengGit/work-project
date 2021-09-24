/*
 * @Author: your name
 * @Date: 2020-08-26 11:05:58
 * @LastEditTime: 2020-08-26 12:37:44
 * @LastEditors: Please set LastEditors
 * @Description: 将list对象转化为树形结构list对象通过pid,id来创建嵌套关联关系
 * setting: {name: '', id: '', pid: ''} 配置显示关联字段名称
 * @FilePath: \eavic_etrip_operation\src\utils\listTotree.js
 */

export default function listToTree({ setting = {}, list }) {
  if (Object.prototype.toString.apply(list) !== '[object Array]') {
    throw Error('转化的对象必须为Array类型')
  }
  const name = setting.name || 'name'
  const key = setting.key || 'id'
  const pId = setting.pId || 'pId'
  list = list.map(item => {
    const data = {
      label: item[name],
      value: `${item[name]}#${item[key]}`, // 搜索关键字 选择后的返回值
      key: `${item[name]}#${item[key]}`,
      pId: item[pId] || 0
    }
    return Object.assign(item, data)
  })
  const temp = {}
  const treeData = []
  // 数组转 键值对
  list.forEach(item => {
    temp[item.id] = item
  })
  // const tempKeys = Object.keys(temp)
  list.forEach(item => {
    // 当前项 pId
    const _itemPId = item.pId
    // 获取父级项
    const parentItemByPid = temp[_itemPId]
    if (parentItemByPid && item.id !== item.pId) {
      if (!parentItemByPid.children) {
        parentItemByPid.children = []
      }
      parentItemByPid.children.push(item)
    } else {
      treeData.push(item)
    }
  })
  return JSON.parse(JSON.stringify(treeData))
}