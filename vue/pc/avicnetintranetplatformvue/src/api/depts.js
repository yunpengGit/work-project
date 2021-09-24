// 部门树懒加载
export const lazyTree = {
  url: '/system/dept/lazyTree',
  method: 'GET'
}
// 根据名称搜部门级联到根节点
export const nameDepts = {
  url: '/system/dept/cascadeTree',
  method: 'GET'
}
// 查询部门列表
export const deptList = {
  url: '/system/dept/list',
  method: 'GET'
}
// 查询部门详情
export const deptDetail = {
  url: '/system/dept/:deptId',
  method: 'GET'
}
// 删除部门
export const cancelDept = {
  url: '/system/dept/remove',
  method: 'POST'
}
// 新增部门
export const addDept = {
  url: '/system/dept',
  method: 'POST'
}
// 编辑部门信息
export const editDept = {
  url: '/system/dept/edit',
  method: 'POST'
}
