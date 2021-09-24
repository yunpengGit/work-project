/*
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-19 15:00:13
 * @LastEditors: peng
 * @LastEditTime: 2021-09-14 14:18:16
 */
/**
 * 内容列表查询
 * @param name	栏目名称
 * @param status	状态（0未启用 1已启用）
 */
export const contents = {
  url: '/portal/cms/manager/contents',
  method: 'GET'
}

/**
 * 内容详细查询
 * @param name	栏目名称
 * @param status	状态（0未启用 1已启用）
 */
export const contentsQueryIds = {
  url: '/portal/cms/contents/:id',
  method: 'GET'
}
/**
 * 内容详细附件预览
 * @param id	附件id
 *
 */
export const fileConvertPreview = {
  url: '/fileConvertPreview/remoteFilePreview/previewUapFile',
  method: 'GET'
}

/**
 * 内容新增
 */
export const contentsAdd = {
  url: '/portal/cms/contents',
  method: 'POST'
}

/**
 * 内容修改
 */
export const contentsEdit = {
  url: '/portal/cms/contents/:id',
  method: 'PUT'
}

/**
 * 内容删除
 */
export const contentsDel = {
  url: '/portal/cms/contents/:id',
  method: 'DELETE'
}

/**
 * 内容删除
 */
export const contentStatus = {
  url: '/portal/cms/contents/:id/status&status=:status',
  method: 'PUT'
}
/**
 * 栏目列表查询
 * @param name	栏目名称
 * @param status	状态（0未启用 1已启用）
 */
export const catalogs = {
  url: '/portal/cms/manager/catalogs/tree/list',
  method: 'GET'
}

/**
   * 栏目列表查询检索
   * @param name	栏目名称
   * @param status	状态（0未启用 1已启用）
   */
export const catalogsQueryId = {
  url: '/portal/cms/catalogs/:id',
  method: 'GET'
}

/**
   * 栏目新增
   */
export const catalogsAdd = {
  url: '/portal/cms/catalogs',
  method: 'POST'
}

/**
   * 栏目修改
   */
export const catalogsEdit = {
  url: '/portal/cms/catalogs/:id&enable=true',
  method: 'PUT'
}

/**
   * 判断栏目及其下级栏目是否被用户订阅
   */
export const ifSubscribed = {
  url: '/portal/cms/catalogs/:id/selfAndChildren/ifSubscribed',
  method: 'GET'
}
/**
   * 判断栏目及其下级栏目是否关联了内容
   */
export const ifHasContents = {
  url: '/portal/cms/catalogs/:id/selfAndChildren/ifHasContents',
  method: 'GET'
}

/**
   * 栏目删除
   */
export const catalogsDel = {
  url: '/portal/cms/catalogs/:id',
  method: 'DELETE'
}

/**
   * 栏目状态更新
   */
export const catalogStatus = {
  url: '/portal/cms/catalogs/:id/status&status=:status',
  method: 'PUT'
}

/**
   * 管理员查询可选栏目树（新增/修改栏目、新增/修改内容页面）
   * filterType (ALL全部栏目 SELF_MANAGE管理范围内的栏目)，不传默认ALL
   */
export const catalogsTree = {
  // baseURL: '/mock',
  url: '/portal/cms/manager/catalogs/selection/tree',
  method: 'GET'
}
/**
   * 管理员查询可选栏目树（新增/修改栏目、新增/修改内容页面）
   * filterType (ALL全部栏目 SELF_MANAGE管理范围内的栏目)，不传默认ALL
   */
export const userCatalogsTree = {
  // baseURL: '/mock',
  url: '/portal/cms/user/catalogs/selection/tree',
  method: 'GET'
}
