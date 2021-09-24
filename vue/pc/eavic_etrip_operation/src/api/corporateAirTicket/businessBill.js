import { axios } from '../request'
// 企业账单分页接口
export function getPageByParams(params) {
  return axios({
    url: '/api/airplane/adminBillCategory/getPageByParams',
    method: 'post',
    data: params
  })
}
// 管理员获取企业绑定的模板列表接口
export function adminGetCategoryTemplateList(params) {
  return axios({
    url: '/api/category/categoryTemplate/adminGetCategoryTemplateList',
    method: 'post',
    params
  })
}
// 企业账单下载接口
export function adminDownloadBillcategory(params) {
  return axios({
    url: '/api/airplane/adminBillCategory/adminDownloadBillcategory',
    method: 'post',
    params
  })
}
// 任务进度查询接口
export function taskProgress(params) {
  return axios({
    url: '/api/uploadordownloadtask/uploadOrDownload/taskProgress',
    method: 'get',
    params
  })
}
