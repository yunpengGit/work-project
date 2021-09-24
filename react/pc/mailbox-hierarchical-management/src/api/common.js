import service from './request'

// 组织结构树
export function orgList (params) {
  return service({
    url: `/api/org/${params.id}/orgList`,
    method: 'get',
  })
}
