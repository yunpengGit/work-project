import { axios } from '../request'

// 任务类型列表查询接口
export function taskTypegetListByParams(params) {
  return axios({
    url: '/api/uploadordownloadtask/taskType/getListByParams',
    method: 'get',
    params
  })
}
// 任务分页查询接口
export function getPageByParams(params) {
  return axios({
    url: '/api/uploadordownloadtask/uploadOrDownload/supplierGetPageByParams',
    method: 'get',
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
