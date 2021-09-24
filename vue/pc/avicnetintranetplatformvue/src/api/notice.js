// 我发起的列表
export const myStartList = {
  url: '/portal/notice/publish/list',
  method: 'GET'
}

// 我发起的公告详情
export const startNoticeDetail = {
  url: '/portal/notice/publish/:id',
  method: 'GET'
}

// 我可见的列表
export const mySeeList = {
  url: '/portal/notice/view/list',
  method: 'GET'
}

// 我可见的公告详情
export const seeNoticeDetail = {
  url: '/portal/notice/view/:id',
  method: 'GET'
}

// 通知公告--新增--保存
export const addSave = {
  url: '/portal/notice/publish',
  method: 'POST'
}

// 通知公告--编辑--保存
export const updateSave = {
  url: '/portal/notice/publish',
  method: 'PUT'
}

// 通知公告--新增--提交审核
export const addSubmit = {
  url: '/portal/notice/publish/submit',
  method: 'POST'
}

// 通知公告--编辑--提交审核
export const updateSubmit = {
  url: '/portal/notice/publish/submit',
  method: 'PUT'
}

// 通知公告--列表--删除
export const listDel = {
  url: '/portal/notice/publish/:id',
  method: 'DELETE'
}

// 通知公告--列表--提交
export const listSubmit = {
  url: '/portal/notice/publish/submitList/:id',
  method: 'GET'
}

// 通知公告--列表--撤回
export const listRecall = {
  url: '/portal/notice/publish/recall/:id/:restartReason',
  method: 'GET'
}

// 详情--审批记录
export const approvalRecord = {
  url: '/portal/notice/publish/bpm/getApprovalRecord/:processInstId',
  method: 'GET'
}

// 详情--访问统计
export const accessStatistics = {
  url: '/portal/notice/view/accessStatistics/:id',
  method: 'GET'
}

// 通知公告文件上传
export const uploadFile = {
  url: '/file/info',
  method: 'POST'
}

// 查询附件文件列表
export const fileList = {
  url: '/file/info/list',
  method: 'GET'
}

// 下载附件文件--支持批量
export const downFile = {
  url: '/file/info/download/:ids',
  method: 'GET'
}

// 删除附件文件
export const deleteFile = {
  url: '/file/info/:ids',
  method: 'DELETE'
}

// 获取组织架构
export const organizationList = {
  url: '/system/dept/treeselect',
  method: 'GET'
}

// 获取组织机构部门下的用户
export const organizationUser = {
  url: '/system/user/list',
  method: 'GET'
}

// 地址簿搜索
export const searchOrganization = {
  url: '/system/dept/searchTreeByName',
  method: 'GET'
}

// // 查询分类列表
// export const classifyList = {
//   url: '/portal/notice/classification/list',
//   method: 'GET'
// }
