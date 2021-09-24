/*
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-04-07 14:53:43
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-04-16 16:49:37
 */
// 公告列表
export const noticeList = {
  url: '/portal/notice/manage/list',
  method: 'GET'
}

// 公告提交
export const noticeSubmitList = {
  url: '/portal/notice/publish/submitList/:id',
  method: 'GET'
}

// 公告撤回
export const noticeRecall = {
  url: '/portal/notice/publish/recall/:id/:restartReason',
  method: 'GET'
}

// 公告详情
export const noticeDetail = {
  url: '/portal/notice/view/:id',
  method: 'GET'
}

//  公告分类
export const noticeClassList = {
  url: '/portal/notice/classification/list',
  method: 'GET'
}

//  公告分类新增
export const noticeClassAdd = {
  url: '/portal/notice/classification/add',
  method: 'POST'
}

//  公告分类修改
export const noticeClassUpdate = {
  url: '/portal/notice/classification/update',
  'Content-Type': 'application/json',
  method: 'POST'
}
//  公告分类停、启用
export const classificationChangeState = {
  url: '/portal/notice/classification/:classificationId/changeState',
  method: 'POST'
}
